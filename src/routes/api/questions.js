const KoaRouter = require('koa-router');
const _ = require('lodash');

const router = new KoaRouter();

function questionParams(params) {
  return _.pick(params, ['title', 'content']);
}

function questionShowSerializer(ctx, question) {
  return ctx.jsonSerializer('question', {
    attributes: ['id', 'title', 'content', 'comments', 'user', 'createdAt'],
    topLevelLinks: {
      self: `${ctx.origin}/api/v1${ctx.router.url('question', { id: question.id })}`,
    },
  }).serialize(question);
}

function questionIndexSerializer(ctx, questions) {
  return ctx.jsonSerializer('questions', {
    attributes: ['id', 'title', 'userId', 'createdAt'],
    topLevelLinks: {
      self: `${ctx.origin}/api/v1${ctx.router.url('questions')}`,
    },
    dataLinks: {
      self: (dataset, question) => `${ctx.origin}/api/v1/questions/${question.id}`,
    },
  }).serialize(questions);
}

router.get('questions', '/', async (ctx) => {
  const questions = await ctx.orm.question.findAll();
  ctx.body = questionIndexSerializer(ctx, questions);
});

router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id, {
    include: [ctx.orm.user, ctx.orm.comment],
  });
  ctx.body = questionShowSerializer(ctx, question);
});

router.post('questionCreate', '/', async (ctx) => {
  try {
    const question = await ctx.orm.question.create({
      ...questionParams(ctx.request.body),
      userId: ctx.state.currentUser.id,
    });
    ctx.algoliaIndex.addObject({
      objectID: Number(question.id) + 40000,
      title: question.title,
      content: question.content,
      type: 'Question',
      url: ctx.state.questionsPath + question.id,
    });
    ctx.body = questionShowSerializer(ctx, question);
    ctx.status = 201;
  } catch (e) {
    ctx.body = {
      message: 'Ha ocurrido un error al crear la pregunta',
      error: e,
    };
    ctx.status = 500;
  }
});

router.patch('questionUpdate', '/:id', async (ctx) => {
  try {
    const question = await ctx.orm.question.findById(ctx.params.id);
    await question.update(questionParams(ctx.request.body));
    ctx.algoliaIndex.addObject({
      objectID: Number(question.id) + 40000,
      title: ctx.requesti.body.title,
      content: ctx.requesti.body.content,
    });
    ctx.body = questionShowSerializer(ctx, question);
    ctx.status = 200;
  } catch (e) {
    ctx.body = {
      message: `Ha ocurrido un error al actualizar la pregunta de id ${ctx.params.id}`,
      error: e,
    };
    ctx.status = 500;
  }
});

router.del('questionDelete', '/:id', async (ctx) => {
  try {
    const question = await ctx.orm.question.findById(ctx.params.id);
    await question.setComments([]);
    await question.destroy();
    ctx.algoliaIndex.deleteObject(Number(question.id) + 40000);
    ctx.status = 204;
  } catch (e) {
    ctx.body = {
      message: `Ha ocurrido un error al eliminar la pregunta de id ${ctx.params.id}`,
      error: e,
    };
    ctx.status = 500;
  }
});

module.exports = router;
