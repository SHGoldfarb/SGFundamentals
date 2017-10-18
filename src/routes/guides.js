const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('guides', '/', async (ctx) => {
  let guides;
  if (ctx.request.query.tagFilter) {
    const tag = await ctx.orm.tag.findById(ctx.request.query.tagFilter);
    guides = await tag.getGuides({ include: [ctx.orm.user, ctx.orm.tag] });
  } else {
    guides = await ctx.orm.guide.findAll({ include: [ctx.orm.user, ctx.orm.tag] });
  }
  await ctx.render('guides/index', {
    guides,
    tags: await ctx.orm.tag.findAll(),
    tagFilterURL: id => `${ctx.router.url('guides')}?tagFilter=${id}`,
    newGuidePath: ctx.router.url('guidesNew'),
    buildGuidePath: id => ctx.router.url('guide', id),
    buildGuideEditPath: id => ctx.router.url('guidesEdit', id),
    buildGuideDeletePath: id => ctx.router.url('guidesDelete', id),
    buildUserPath: id => ctx.router.url('user', id),
  });
});

router.get('guidesNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    const guide = await ctx.orm.guide.build();
    await ctx.render('guides/new', {
      guide,
      submitGuidePath: ctx.router.url('guidesCreate'),
      backToListPath: ctx.router.url('guides'),
    });
  }
});

router.post('guidesCreate', '/', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    try {
      const guide = await ctx.orm.guide.create(ctx.request.body);
      ctx.redirect(ctx.router.url('guide', { id: guide.id }));
    } catch (validationError) {
      await ctx.render('guides/new', {
        guide: ctx.orm.guide.build(ctx.request.body),
        submitGuidePath: ctx.router.url('guidesCreate'),
        backToListPath: ctx.router.url('guides'),
        error: validationError,
      });
    }
  }
});

router.get('guide', '/:id', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!guide) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
  const owner = await guide.getUser();
  await ctx.render('guides/show', {
    guide,
    editGuidePath: ctx.router.url('guidesEdit', { id: ctx.params.id }),
    deleteGuidePath: ctx.router.url('guidesDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('guides'),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    returnPath: ctx.router.url('guide', { id: ctx.params.id }),
    tags: await guide.getTags(),
    createTagPath: ctx.router.url('tagsCreate'),
    buildTagDeletePath: id => ctx.router.url('tagsDelete', { id }),
    excercise: await ctx.orm.excercise.build(),
    submitExcercisePath: ctx.router.url('excercisesCreate'),
    excercises: await guide.getExcercises(),
    buildExcerciseDeletePath: id => ctx.router.url('excercisesDelete', { id }),
    buildExcercisePath: id => ctx.router.url('excercise', { id }),
    buildExcerciseEditPath: id => ctx.router.url('excercisesEdit', { id }),
  });
});

router.get('guidesEdit', '/:id/edit', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(guide.userId))) {
    await ctx.render('guides/edit', {
      guide,
      submitGuidePath: ctx.router.url('guidesUpdate', { id: ctx.params.id }),
      deleteGuidePath: ctx.router.url('guidesDelete', { id: ctx.params.id }),
      backToListPath: ctx.router.url('guides'),
    });
  }
});

router.patch('guidesUpdate', '/:id', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(guide.userId))) {
    try {
      await guide.update(ctx.request.body);
      ctx.redirect(ctx.router.url('guide', { id: ctx.params.id }));
    } catch (validationError) {
      await guide.set(ctx.request.body);
      await ctx.render('guides/edit', {
        guide,
        submitGuidePath: ctx.router.url('guidesUpdate', { id: ctx.params.id }),
        deleteGuidePath: ctx.router.url('guidesDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('guides'),
        error: validationError,
      });
    }
  }
});

router.delete('guidesDelete', '/:id', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(guide.userId))) {
    await guide.destroy();
    ctx.redirect(ctx.router.url('guides'));
  }
});

module.exports = router;
