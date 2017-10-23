const KoaRouter = require('koa-router');

const router = new KoaRouter();
const _ = require('lodash');


router.use('/', async (ctx, next) => {
  ctx.state.submitQuestionPath = ctx.router.url('questionsCreate');
  await next();
});


router.get('questions', '/', async (ctx) => {
  let questions;
  if (ctx.request.query.tagFilter) {
    const tag = await ctx.orm.tag.find({ where: { name: ctx.request.query.tagFilter } });
    if (tag) {
      questions = await tag.getQuestions({ include: [ctx.orm.user, ctx.orm.tag] });
    }
  }
  if (!questions) {
    questions = await ctx.orm.question.findAll({ include: [ctx.orm.user, ctx.orm.tag] });
  }
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('questions/index', {
    questions,
    tags,
    newQuestionPath: ctx.router.url('questionsNew'),
    buildQuestionEditPath: id => ctx.router.url('questionsEdit', { id }),
  });
});

router.get('questionsNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    const question = await ctx.orm.question.build();
    await ctx.render('questions/new', {
      question,
      backToListPath: ctx.router.url('questions'),
    });
  }
});

router.post('questionsCreate', '/', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    try {
      const question = await ctx.orm.question.create(ctx.request.body);
      ctx.redirect(ctx.router.url('question', { id: question.id }));
    } catch (validationError) {
      await ctx.render('questions/new', {
        question: ctx.orm.question.build(ctx.request.body),
        backToListPath: ctx.router.url('questions'),
        error: validationError,
      });
    }
  }
});

router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id, {
    include: [ctx.orm.user, ctx.orm.tag, ctx.orm.vote],
  });
  if (!question) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
  const comments = await question.getComments({
    include: [ctx.orm.user, {
      model: ctx.orm.comment,
      as: 'child',
      include: [ctx.orm.user, ctx.orm.vote],
    }, ctx.orm.vote] });
  const owner = await question.getUser();
  await ctx.render('questions/show', {
    question,
    editQuestionPath: ctx.router.url('questionsEdit', { id: ctx.params.id }),
    deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('questions'),
    returnPath: ctx.router.url('question', { id: ctx.params.id }),
    comments,
    tags: await ctx.orm.tag.findAll(),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    voteQuestionPath: ctx.router.url('questionVote', { id: ctx.params.id }),
    reportCreatePath: ctx.router.url('reportsCreate'),
  });
});

router.get('questionsEdit', '/:id/edit', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(question.userId))) {
    await ctx.render('questions/edit', {
      question,
      submitQuestionPath: ctx.router.url('questionsUpdate', { id: ctx.params.id }),
      deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
      backToListPath: ctx.router.url('questions'),
    });
  }
});

router.patch('questionsUpdate', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(question.userId))) {
    try {
      await question.update(ctx.request.body);
      ctx.redirect(ctx.router.url('question', { id: ctx.params.id }));
    } catch (validationError) {
      await question.set(ctx.request.body);
      await ctx.render('questions/edit', {
        question,
        submitQuestionPath: ctx.router.url('questionsUpdate', { id: ctx.params.id }),
        deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('questions'),
        error: validationError,
      });
    }
  }
});

router.delete('questionsDelete', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(question.userId))) {
    await question.setComments([]);
    await question.destroy();
    ctx.redirect(ctx.router.url('questions'));
  }
});

module.exports = router;
