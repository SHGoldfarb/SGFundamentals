/* eslint no-await-in-loop: "off", arrow-body-style: "off" */

const KoaRouter = require('koa-router');
const _ = require('lodash');

const router = new KoaRouter();

router.use('/', async (ctx, next) => {
  ctx.state.submitQuestionPath = ctx.router.url('questionsCreate');
  await next();
});


router.get('questions', '/', async (ctx) => {
  let questions = [];
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
          questions = await tag.getQuestions(
            { include: [ctx.orm.user, ctx.orm.tag] },
          );
        } else {
          const newQuestions = await tag.getQuestions(
            { include: [ctx.orm.user, ctx.orm.tag] },
          );
          questions = _.intersectionBy(questions, newQuestions, e => e.id);
        }
      } else {
        questions = [];
        break;
      }
    }
  } else {
    questions = await ctx.orm.question.findAll({
      include: [ctx.orm.user, ctx.orm.tag],
    });
  }
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('questions/index', {
    filters,
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
      ctx.algoliaIndex.addObject({
        objectID: Number(question.id) + 40000,
        title: question.title,
        content: question.content,
        type: 'Question',
        url: ctx.state.questionsPath + question.id,
      });
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
  for (const i in comments) {
    comments[i].child = _.reverse(_.sortBy(comments[i].child, (c) => {
      return _.filter(c.votes, { type: true }).length - _.filter(c.votes, { type: false }).length;
    }));
  }
  const sortedComments = _.reverse(_.sortBy(comments, (c) => {
    return _.filter(c.votes, { type: true }).length - _.filter(c.votes, { type: false }).length;
  }));
  switch (ctx.accepts('html', 'json')) {
    case 'html':
      await ctx.render('questions/show', {
        question,
        editQuestionPath: ctx.router.url('questionsEdit', { id: ctx.params.id }),
        deleteQuestionPath: ctx.router.url('questionsDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('questions'),
        returnPath: ctx.router.url('question', { id: ctx.params.id }),
        comments: sortedComments,
        tags: await ctx.orm.tag.findAll(),
        isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
        voteQuestionPath: ctx.router.url('questionVote', { id: ctx.params.id }),
        reportCreatePath: ctx.router.url('reportsCreate'),
      });
      break;
    case 'json':
      ctx.body = {
        question,
        comments: sortedComments,
        tags: await ctx.orm.tag.findAll(),
      };
      break;
    default:
  }
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
      ctx.algoliaIndex.addObject({
        objectID: Number(question.id) + 40000,
        title: ctx.requesti.body.title,
        content: ctx.requesti.body.content,
      });
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
    ctx.algoliaIndex.deleteObject(Number(question.id) + 40000);
    ctx.redirect(ctx.router.url('questions'));
  }
});

module.exports = router;
