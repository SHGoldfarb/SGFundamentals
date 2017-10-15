const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('index', '/', async (ctx) => {
  await ctx.render('index', {
    appVersion: pkg.version,
    questions: await ctx.orm.question.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [ctx.orm.tag],
    }),
    guides: await ctx.orm.guide.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [ctx.orm.tag],
    }),
    buildQuestionPath: id => ctx.router.url('question', { id }),
    buildGuidePath: id => ctx.router.url('guide', { id }),
  });
});

module.exports = router;
