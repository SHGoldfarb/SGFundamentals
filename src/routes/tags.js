const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('tagsCreate', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const tag = await ctx.orm.tag.create(ctx.request.body);
    if (ctx.request.body.questionId) {
      await tag.addQuestion(await ctx.orm.question.findById(ctx.request.body.questionId));
    }
    if (ctx.request.body.excerciseId) {
      await tag.addExcercise(await ctx.orm.excercise.findById(ctx.request.body.excerciseId));
    }
    if (ctx.request.body.fileId) {
      await tag.addFile(await ctx.orm.file.findById(ctx.request.body.fileId));
    }
    if (ctx.request.body.guideId) {
      await tag.addGuide(await ctx.orm.guide.findById(ctx.request.body.guideId));
    }
    ctx.redirect(ctx.request.body.returnPath);
  }
});

router.delete('tagsDelete', '/:id', async (ctx) => {
  const tag = await ctx.orm.tag.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(tag.userId))) {
    await tag.setQuestions([]);
    await tag.setExcercises([]);
    await tag.setFiles([]);
    await tag.setGuides([]);
    await tag.destroy();
    ctx.redirect(ctx.request.body.returnPath);
  }
});

module.exports = router;
