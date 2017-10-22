const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('tagsCreate', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    let tag = await ctx.orm.tag.find({ where: { name: ctx.request.body.name } });
    if (!tag) {
      tag = await ctx.orm.tag.create(ctx.request.body);
    }
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

router.patch('tagsUnset', '/unset/:id', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const tag = await ctx.orm.tag.findById(ctx.params.id);
    if (tag) {
      if (ctx.request.body.questionId) {
        await tag.removeQuestion(await ctx.orm.question.findById(ctx.request.body.questionId));
      }
      if (ctx.request.body.excerciseId) {
        await tag.removeExcercise(await ctx.orm.excercise.findById(ctx.request.body.excerciseId));
      }
      if (ctx.request.body.fileId) {
        await tag.removeFile(await ctx.orm.file.findById(ctx.request.body.fileId));
      }
      if (ctx.request.body.guideId) {
        const guide = await ctx.orm.guide.findById(ctx.request.body.guideId, {
          include: [ctx.orm.excercise],
        });
        console.log('\n\n\nSAMMM');
        await tag.removeExcercises(guide.excercises);
        await tag.removeGuide(guide);
      }
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
