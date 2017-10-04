const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('comments', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const comments = await ctx.orm.comment.findAll();
    await ctx.render('comments/index', {
      comments,
      newCommentPath: ctx.router.url('commentsNew'),
      buildCommentPath: id => ctx.router.url('comment', { id }),
      buildCommentEditPath: id => ctx.router.url('commentsEdit', { id }),
      buildCommentDeletePath: id => ctx.router.url('commentsDelete', { id }),
    });
  }
});

router.get('commentsNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotAdmin()) {
    const comment = await ctx.orm.comment.build();
    await ctx.render('comments/new', {
      comment,
      submitCommentPath: ctx.router.url('commentsCreate'),
      backToListPath: ctx.router.url('comments'),
    });
  }
});

router.post('commentsCreate', '/', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    // Temporal!----
    ctx.request.body.commentId = ctx.request.body.commentId === '' ? null : ctx.request.body.commentId;
    ctx.request.body.questionId = ctx.request.body.questionId === '' ? null : ctx.request.body.questionId;
    ctx.request.body.excerciseId = ctx.request.body.excerciseId === '' ? null : ctx.request.body.excerciseId;
    //  ---Temporal
    try {
      const comment = await ctx.orm.comment.create(ctx.request.body);
      if (!ctx.request.body.returnPath) {
        ctx.request.body.returnPath = ctx.router.url('comment', { id: comment.id });
      }
      ctx.redirect(ctx.request.body.returnPath);
    } catch (validationError) {
      await ctx.render('comments/new', {
        comment: ctx.orm.comment.build(ctx.request.body),
        submitCommentPath: ctx.router.url('commentsCreate'),
        backToListPath: ctx.router.url('comments'),
        error: validationError,
      });
    }
  }
});

router.get('comment', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  const comments = await comment.getComments({ include: [ctx.orm.user] });
  const owner = await comment.getUser();
  await ctx.render('comments/show', {
    comment,
    editCommentPath: ctx.router.url('commentsEdit', { id: ctx.params.id }),
    deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('comments'),
    comments,
    createCommentPath: ctx.router.url('commentsCreate'),
    returnPath: ctx.router.url('comment', { id: ctx.params.id }),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    buildCommentDeletePath: id => ctx.router.url('commentsDelete', { id }),
  });
});

router.get('commentsEdit', '/:id/edit', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(comment.userId))) {
    await ctx.render('comments/edit', {
      comment,
      submitCommentPath: ctx.router.url('commentsUpdate', { id: ctx.params.id }),
      deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
      backToListPath: ctx.router.url('comments'),
    });
  }
});

router.patch('commentsUpdate', '/:id', async (ctx) => {
  // Temporal! ----
  ctx.request.body.commentId = ctx.request.body.commentId === '' ? null : ctx.request.body.commentId;
  ctx.request.body.questionId = ctx.request.body.questionId === '' ? null : ctx.request.body.questionId;
  ctx.request.body.excerciseId = ctx.request.body.excerciseId === '' ? null : ctx.request.body.excerciseId;
  //  ---- Temporal
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(comment.userId))) {
    try {
      await comment.update(ctx.request.body);
      ctx.redirect(ctx.router.url('comment', { id: ctx.params.id }));
    } catch (validationError) {
      await comment.set(ctx.request.body);
      await ctx.render('comments/edit', {
        comment,
        submitCommentPath: ctx.router.url('commentsUpdate', { id: ctx.params.id }),
        deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('comments'),
        error: validationError,
      });
    }
  }
});

router.delete('commentsDelete', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(comment.userId))) {
    await comment.setComments([]);
    await comment.destroy();
    if (!ctx.request.body.returnPath) {
      ctx.request.body.returnPath = ctx.router.url('comments');
    }
    ctx.redirect(ctx.request.body.returnPath);
  }
});

module.exports = router;
