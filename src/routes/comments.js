const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('comments', '/', async (ctx) => {
  const comments = await ctx.orm.comment.findAll();
  await ctx.render('comments/index', {
    comments,
    newCommentPath: ctx.router.url('commentsNew'),
    buildCommentPath: id => ctx.router.url('comment', { id }),
    buildCommentEditPath: id => ctx.router.url('commentsEdit', { id }),
    buildCommentDeletePath: id => ctx.router.url('commentsDelete', { id }),
  });
});

router.get('commentsNew', '/new', async (ctx) => {
  const comment = await ctx.orm.comment.build();
  await ctx.render('comments/new', {
    comment,
    submitCommentPath: ctx.router.url('commentsCreate'),
    backToList: ctx.router.url('comments'),
  });
});

router.post('commentsCreate', '/', async (ctx) => {
  ctx.request.body.commentId = ctx.request.body.commentId === '' ? null : ctx.request.body.commentId;
  ctx.request.body.questionId = ctx.request.body.questionId === '' ? null : ctx.request.body.questionId;
  ctx.request.body.excerciseId = ctx.request.body.excerciseId === '' ? null : ctx.request.body.excerciseId;
  try {
    const comment = await ctx.orm.comment.create(ctx.request.body);
    ctx.redirect(ctx.router.url('comment', { id: comment.id }));
  } catch (validationError) {
    await ctx.render('comments/new', {
      comment: ctx.orm.comment.build(ctx.request.body),
      submitCommentPath: ctx.router.url('commentsCreate'),
      backToList: ctx.router.url('comments'),
      error: validationError,
    });
  }
});

router.get('comment', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  const comments = await comment.getComments();
  await ctx.render('comments/show', {
    comment,
    editCommentPath: ctx.router.url('commentsEdit', { id: ctx.params.id }),
    deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('comments'),
    comments,
  });
});

router.get('commentsEdit', '/:id/edit', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  await ctx.render('comments/edit', {
    comment,
    submitCommentPath: ctx.router.url('commentsUpdate', { id: ctx.params.id }),
    deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
    backToList: ctx.router.url('comments'),
  });
});

router.patch('commentsUpdate', '/:id', async (ctx) => {
  ctx.request.body.commentId = ctx.request.body.commentId === '' ? null : ctx.request.body.commentId;
  ctx.request.body.questionId = ctx.request.body.questionId === '' ? null : ctx.request.body.questionId;
  ctx.request.body.excerciseId = ctx.request.body.excerciseId === '' ? null : ctx.request.body.excerciseId;
  try {
    const comment = await ctx.orm.comment.findById(ctx.params.id);
    await comment.update(ctx.request.body);
    ctx.redirect(ctx.router.url('comment', { id: ctx.params.id }));
  } catch (validationError) {
    const comment = await ctx.orm.comment.findById(ctx.params.id);
    await comment.set(ctx.request.body);
    await ctx.render('comments/edit', {
      comment,
      submitCommentPath: ctx.router.url('commentsUpdate', { id: ctx.params.id }),
      deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
      backToList: ctx.router.url('comments'),
      error: validationError,
    });
  }
});

router.delete('commentsDelete', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  await comment.setComments([]);
  await comment.destroy();
  ctx.redirect(ctx.router.url('comments'));
});

module.exports = router;
