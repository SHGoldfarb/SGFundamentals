const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const questions = await ctx.orm.question.findAll();
  ctx.body = ctx.jsonSerializer('questions', {
    attributes: ['id', 'title', 'userId', 'createdAt'],
    topLevelLinks: {
      self: `${ctx.origin}/api/v1${ctx.router.url('questions')}`,
    },
    dataLinks: {
      self: (dataset, question) => `${ctx.origin}/api/v1/questions/${question.id}`,
    },
  }).serialize(questions);
});

router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id, {
    include: [ctx.orm.user, ctx.orm.comment],
  });
  ctx.body = ctx.jsonSerializer('question', {
    attributes: ['id', 'title', 'content', 'comments', 'createdAt'],
    topLevelLinks: {
      self: `${ctx.origin}/api/v1${ctx.router.url('question', { id: ctx.params.id })}`,
    },
  }).serialize(question);
});

module.exports = router;
