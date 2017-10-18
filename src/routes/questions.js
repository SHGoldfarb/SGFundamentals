const KoaRouter = require('koa-router');

const router = new KoaRouter();

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
    tagFilterURL: id => `${ctx.router.url('questions')}?tagFilter=${id}`,
    newQuestionPath: ctx.router.url('questionsNew'),
    buildQuestionPath: id => ctx.router.url('question', { id }),
    buildQuestionEditPath: id => ctx.router.url('questionsEdit', { id }),
    buildQuestionDeletePath: id => ctx.router.url('questionsDelete', { id }),
    buildUserPath: id => ctx.router.url('user', { id }),
  });
});

router.get('questionsNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    const question = await ctx.orm.question.build();
    await ctx.render('questions/new', {
      question,
      submitQuestionPath: ctx.router.url('questionsCreate'),
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
        submitQuestionPath: ctx.router.url('questionsCreate'),
        backToListPath: ctx.router.url('questions'),
        error: validationError,
      });
    }
  }
});

router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  if (!question) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
  const owner = await question.getUser();
  await ctx.render('questions/show', {
    question,
    editQuestionPath: ctx.router.url('questionsEdit', { id: ctx.params.id }),
    deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('questions'),
    createCommentPath: ctx.router.url('commentsCreate'),
    returnPath: ctx.router.url('question', { id: ctx.params.id }),
    comments: await question.getComments({ include: [ctx.orm.user] }),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    tags: await question.getTags(),
    createTagPath: ctx.router.url('tagsCreate'),
    buildTagDeletePath: id => ctx.router.url('tagsDelete', { id }),
    buildCommentDeletePath: id => ctx.router.url('commentsDelete', { id }),
    buildCommentPath: id => ctx.router.url('comment', { id }),
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
