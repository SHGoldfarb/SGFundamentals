const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('excercises', '/', async (ctx) => {
  const excercises = await ctx.orm.excercise.findAll();
  await ctx.render('excercises/index', {
    excercises,
    newExcercisePath: ctx.router.url('excercisesNew'),
    buildExcercisePath: id => ctx.router.url('excercise', id),
    buildExcerciseEditPath: id => ctx.router.url('excercisesEdit', id),
    buildExcerciseDeletePath: id => ctx.router.url('excercisesDelete', id),
  });
});

router.get('excercisesNew', '/new', async (ctx) => {
  const excercise = await ctx.orm.excercise.build();
  await ctx.render('excercises/new', {
    excercise,
    submitExcercisePath: ctx.router.url('excercisesCreate'),
    backToList: ctx.router.url('excercises'),
  });
});

router.post('excercisesCreate', '/', async (ctx) => {
  try {
    const excercise = await ctx.orm.excercise.create(ctx.request.body);
    ctx.redirect(ctx.router.url('excercise', { id: excercise.id }));
  } catch (validationError) {
    await ctx.render('excercises/new', {
      excercise: ctx.orm.excercise.build(ctx.request.body),
      submitExcercisePath: ctx.router.url('excercisesCreate'),
      backToList: ctx.router.url('excercises'),
      error: validationError,
    });
  }
});

router.get('excercise', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  await ctx.render('excercises/show', {
    excercise,
    editExcercisePath: ctx.router.url('excercisesEdit', { id: ctx.params.id }),
    deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('excercises'),
  });
});

router.get('excercisesEdit', '/:id/edit', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  await ctx.render('excercises/edit', {
    excercise,
    submitExcercisePath: ctx.router.url('excercisesUpdate', { id: ctx.params.id }),
    deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('excercises'),
  });
});

router.patch('excercisesUpdate', '/:id', async (ctx) => {
  try {
    const excercise = await ctx.orm.excercise.findById(ctx.params.id);
    await excercise.update(ctx.request.body);
    ctx.redirect(ctx.router.url('excercise', { id: ctx.params.id }));
  } catch (validationError) {
    const excercise = await ctx.orm.excercise.findById(ctx.params.id);
    await excercise.set(ctx.request.body);
    await ctx.render('excercises/edit', {
      excercise,
      submitExcercisePath: ctx.router.url('excercisesUpdate', { id: ctx.params.id }),
      deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
      backToList: ctx.router.url('excercises'),
      error: validationError,
    });
  }
});

router.delete('excercisesDelete', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  await excercise.destroy();
  ctx.redirect(ctx.router.url('excercises'));
});

module.exports = router;
