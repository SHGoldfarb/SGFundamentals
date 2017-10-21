const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('excercises', '/', async (ctx) => {
  let excercises = false;
  if (ctx.request.query.tagFilter) {
    const tag = await ctx.orm.tag.find({ where: { name: ctx.request.query.tagFilter } });
    if (tag) {
      excercises = await tag.getExcercises({ include: [ctx.orm.user, ctx.orm.tag, ctx.orm.guide] });
    }
  }
  if (!excercises) {
    excercises = await ctx.orm.excercise.findAll({
      include: [ctx.orm.user, ctx.orm.tag, ctx.orm.guide],
    });
  }
  await ctx.render('excercises/index', {
    excercises,
    tags: await ctx.orm.tag.findAll(),
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
  await ctx.render('excercises/show', {
    excercise,
    editExcercisePath: ctx.router.url('excercisesEdit', { id: ctx.params.id }),
    deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('excercises'),
    comments,
    returnPath: ctx.router.url('excercise', { id: ctx.params.id }),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    tags: await excercise.getTags(),
    backToGuidePath: ctx.router.url('guide', excercise.guideId),
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
    await excercise.destroy();
    if (!ctx.request.body.returnPath) {
      ctx.request.body.returnPath = ctx.router.url('excercises');
    }
    ctx.redirect(ctx.request.body.returnPath);
  }
});

module.exports = router;
