const KoaRouter = require('koa-router');
const _ = require('lodash');

const router = new KoaRouter();

router.get('excercises', '/', async (ctx) => {
  let excercises = [];
  let filters = [];
  let tag;
  let filter;
  if (ctx.request.query.tagFilter || ctx.request.query.remove) {
    if (ctx.request.query.tagFilter) {
      if (ctx.request.query.oldFilters) {
        filters = _.concat([ctx.request.query.tagFilter], ctx.request.query.oldFilters.split(';'));
      } else {
        filters = [ctx.request.query.tagFilter];
      }
    } else {
      filters = ctx.request.query.oldFilters.split(';');
      _.remove(filters, e => e === ctx.request.query.remove);
    }
  }
  if (filters.length > 0) {
    for (let i = 0; i < filters.length; i += 1) {
      filter = filters[i];
      try {
        tag = await ctx.orm.tag.find({ where: { name: filter } });
      } catch (e) {
        tag = false;
      }
      if (tag) {
        if (i === 0) {
          excercises = await tag.getExcercises(
            { include: [ctx.orm.user, ctx.orm.tag, ctx.orm.guide] },
          );
        } else {
          const newExcercises = await tag.getExcercises(
            { include: [ctx.orm.user, ctx.orm.tag, ctx.orm.guide] },
          );
          excercises = _.intersectionBy(excercises, newExcercises, e => e.id);
        }
      } else {
        excercises = [];
        break;
      }
    }
  } else {
    excercises = await ctx.orm.excercise.findAll({
      include: [ctx.orm.user, ctx.orm.tag, ctx.orm.guide],
    });
  }
  await ctx.render('excercises/index', {
    excercises,
    tags: await ctx.orm.tag.findAll(),
    filters,
  });
});

router.get('excercisesNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    const excercise = await ctx.orm.excercise.build();
    await ctx.render('excercises/new', {
      excercise,
      backToListPath: ctx.router.url('excercises'),
    });
  }
});

router.post('excercisesCreate', '/', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    try {
      const excercise = await ctx.orm.excercise.create(ctx.request.body);
      if (!ctx.request.body.returnPath) {
        ctx.request.body.returnPath = ctx.router.url('excercise', { id: excercise.id });
      }
      ctx.excerciseIndex.addObject({
        objectID: excercise.id,
        content: excercise.content,
      });
      ctx.redirect(ctx.request.body.returnPath);
    } catch (validationError) {
      ctx.state.error = validationError; // needs fixing
      ctx.redirect(ctx.router.url('excercises'));
      // await ctx.render('excercises/new', {
      //   excercise: ctx.orm.excercise.build(ctx.request.body),
      //   backToListPath: ctx.router.url('excercises'),
      //   error: validationError,
      // });
    }
  }
});

router.get('excercise', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id, {
    include: [ctx.orm.user, ctx.orm.tag, ctx.orm.vote],
  });
  if (!excercise) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
  const owner = await excercise.getUser();
  const comments = await excercise.getComments({
    include: [ctx.orm.user, {
      model: ctx.orm.comment,
      as: 'child',
      include: [ctx.orm.user, ctx.orm.vote],
    }, ctx.orm.vote] });
  comments.forEach((comment) => {
    comment.child = _.reverse(_.sortBy(comment.child, (c) => {
      return _.filter(c.votes, { type: true }).length - _.filter(c.votes, { type: false }).length;
    }));
  });
  const sortedComments = _.reverse(_.sortBy(comments, (c) => {
    return _.filter(c.votes, { type: true }).length - _.filter(c.votes, { type: false }).length;
  }));
  await ctx.render('excercises/show', {
    excercise,
    editExcercisePath: ctx.router.url('excercisesEdit', { id: ctx.params.id }),
    deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('excercises'),
    comments: sortedComments,
    returnPath: ctx.router.url('excercise', { id: ctx.params.id }),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    tags: await ctx.orm.tag.findAll(),
    backToGuidePath: ctx.router.url('guide', excercise.guideId),
    reportCreatePath: ctx.router.url('reportsCreate'),
  });
});

router.get('excercisesEdit', '/:id/edit', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(excercise.userId))) {
    await ctx.render('excercises/edit', {
      excercise,
      submitExcercisePath: ctx.router.url('excercisesUpdate', { id: ctx.params.id }),
      deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
      backToListPath: ctx.router.url('excercises'),
    });
  }
});

router.patch('excercisesUpdate', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(excercise.userId))) {
    try {
      await excercise.update(ctx.request.body);
      ctx.excerciseIndex.addObject({
        objectID: excercise.id,
        content: ctx.request.body.content,
      });
      ctx.redirect(ctx.router.url('excercise', { id: ctx.params.id }));
    } catch (validationError) {
      await excercise.set(ctx.request.body);
      await ctx.render('excercises/edit', {
        excercise,
        submitExcercisePath: ctx.router.url('excercisesUpdate', { id: ctx.params.id }),
        deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('excercises'),
        error: validationError,
      });
    }
  }
});

router.delete('excercisesDelete', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(excercise.userId))) {
    await excercise.setComments([]);
    await excercise.setTags([]);
    await excercise.destroy();
    if (!ctx.request.body.returnPath) {
      ctx.request.body.returnPath = ctx.router.url('excercises');
    }
    ctx.excerciseIndex.deleteObject(excercise.id);
    ctx.redirect(ctx.request.body.returnPath);
  }
});

module.exports = router;
