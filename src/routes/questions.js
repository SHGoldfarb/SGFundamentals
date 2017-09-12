const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const questions = await ctx.orm.question.findAll();
  await ctx.render('questions/index', {
    questions,
    newQuestionPath: ctx.router.url('questionsNew'),
    buildQuestionPath: id => ctx.router.url('question', { id }),
    buildQuestionEditPath: id => ctx.router.url('questionsEdit', { id }),
    buildQuestionDeletePath: id => ctx.router.url('questionsDelete', { id }),
  });
});

router.get('questionsNew', '/new', async (ctx) => {
  const question = await ctx.orm.question.build();
  await ctx.render('questions/new', {
    question,
    createQuestionPath: ctx.router.url('questionsCreate'),
    backToList: ctx.router.url('questions'),
  });
});

router.post('excercisesCreate', '/', async (ctx) => {
  const excercise = await ctx.orm.excercise.create(ctx.request.body);
  ctx.redirect(ctx.router.url('excercise', { id: excercise.id }));
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
    updateExcercisePath: ctx.router.url('excercisesUpdate', { id: ctx.params.id }),
    deleteExcercisePath: ctx.router.url('excercisesDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('excercises'),
  });
});

router.patch('excercisesUpdate', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  await excercise.update(ctx.request.body);
  ctx.redirect(ctx.router.url('excercise', { id: ctx.params.id }));
});

router.delete('excercisesDelete', '/:id', async (ctx) => {
  const excercise = await ctx.orm.excercise.findById(ctx.params.id);
  await excercise.destroy();
  ctx.redirect(ctx.router.url('excercises'));
});

module.exports = router;
