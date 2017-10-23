const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('reports', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const reports = await ctx.orm.report.findAll({
      include: [ctx.orm.user, ctx.orm.question, ctx.orm.excercise, ctx.orm.comment, ctx.orm.guide],
    });
    await ctx.render('reports/index', {
      reports,
      buildReportDeletePath: id => ctx.router.url('reportsDelete', { id }),
      returnPath: ctx.state.currentUrl,
    });
  }
});

router.post('reportsCreate', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const report = await ctx.orm.report.create({ userId: ctx.state.currentUser.id });

    switch (ctx.request.body.resource) {
      case 'question':
        await report.setQuestion(await ctx.orm.question.findById(ctx.request.body.resourceId));
        break;
      case 'excercise':
        await report.setExcercise(await ctx.orm.excercise.findById(ctx.request.body.resourceId));
        break;
      case 'guide':
        await report.setGuide(await ctx.orm.guide.findById(ctx.request.body.resourceId));
        break;
      case 'comment':
        await report.setComment(await ctx.orm.comment.findById(ctx.request.body.resourceId));
        break;
      default:
        throw new Error('Report has no valid resource');
    }
    await report.save();
    ctx.redirect(ctx.request.body.returnPath);
  }
});

router.delete('reportsDelete', '/:id', async (ctx) => {
  const report = await ctx.orm.report.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotAdmin()) && report) {
    await report.destroy();
  }
  ctx.redirect(ctx.router.url('reports'));
});

module.exports = router;
