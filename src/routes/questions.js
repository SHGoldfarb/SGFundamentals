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

router.post('questionsCreate', '/', async (ctx) => {
  const question = await ctx.orm.question.create(ctx.request.body);
  ctx.redirect(ctx.router.url('question', { id: question.id }));
});

router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  await ctx.render('questions/show', {
    question,
    editQuestionPath: ctx.router.url('questionsEdit', { id: ctx.params.id }),
    deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('questions'),
  });
});

router.get('questionsEdit', '/:id/edit', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  await ctx.render('questions/edit', {
    question,
    updateQuestionPath: ctx.router.url('questionsUpdate', { id: ctx.params.id }),
    deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('questions'),
  });
});

router.patch('questionsUpdate', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  await question.update(ctx.request.body);
  ctx.redirect(ctx.router.url('question', { id: ctx.params.id }));
});

router.delete('questionsDelete', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  await question.destroy();
  ctx.redirect(ctx.router.url('questions'));
});

module.exports = router;