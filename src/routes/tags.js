const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('tagsCreate', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const tag = await ctx.orm.tag.create(ctx.request.body);
    if (ctx.request.body.questionId) {
      tag.addQuestion(await ctx.orm.question.findById(ctx.request.body.questionId));
    }
    if (ctx.request.body.escerciseId) {
      tag.addExcercise(await ctx.orm.escercise.findById(ctx.request.body.escerciseId));
    }
    if (ctx.request.body.fileId) {
      tag.addFile(await ctx.orm.file.findById(ctx.request.body.fileId));
    }
    ctx.redirect(ctx.request.body.returnPath);
  }
});

router.delete('tagsDelete', '/:id', async (ctx) => {
  const tag = await ctx.orm.tag.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(tag.userId))) {
    await tag.setQuestions([]);
    await tag.destroy();
    ctx.redirect(ctx.request.body.returnPath);
  }
});

module.exports = router;
