const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.use('/', async (ctx, next) => {
  ctx.state.submitCommentPath = ctx.router.url('commentsCreate');
  ctx.state.backToListPath = ctx.router.url('comments');
  await next();
});

router.get('comments', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const comments = await ctx.orm.comment.findAll();
    await ctx.render('comments/index', {
      comments,
    });
  }
});

router.get('commentsNew', '/new', async (ctx) => {
  throw new Error('Not Found');
  // if (!await ctx.redirectIfNotAdmin()) {
  //   const comment = await ctx.orm.comment.build();
  //   await ctx.render('comments/new', {
  //     comment,
  //     backToListPath: ctx.router.url('comments'),
  //   });
  // }
});

router.post('commentsCreate', '/', async (ctx) => {
  if (!await ctx.redirectIfNotOwnerOrAdmin(ctx.request.body.userId)) {
    try {
      const comment = await ctx.orm.comment.create(ctx.request.body);
      if (!ctx.request.body.returnPath) {
        ctx.request.body.returnPath = ctx.router.url('comment', { id: comment.id });
      }
      ctx.redirect(ctx.request.body.returnPath);
    } catch (validationError) {
      console.log('Catched error in router-commentsCreate:');
      console.log(validationError.message);
      await ctx.redirect(ctx.state.currentUrl);
    }
  }
});

router.get('comment', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  if (!comment) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
  const parent = await comment.getParent();
  const parentType = await comment.getParentTypeStr();
  console.log(parentType + parent.id);
  ctx.redirect(ctx.router.url(parentType, { id: parent.id }));

  // const comments = await comment.getComments({ include: [ctx.orm.user] });
  // const owner = await comment.getUser();
  // let parent;
  // let parentId;
  // if (comment.questionId) {
  //   parent = 'question';
  //   parentId = comment.questionId;
  // } else if (comment.excerciseId) {
  //   parent = 'excercise';
  //   parentId = comment.excerciseId;
  // } else {
  //   parent = 'comment';
  //   parentId = comment.commentId;
  // }
  // await ctx.render('comments/show', {
  //   comment,
  //   editCommentPath: ctx.router.url('commentsEdit', { id: ctx.params.id }),
  //   deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
  //   comments,
  //   returnPath: ctx.router.url('comment', { id: ctx.params.id }),
  //   isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
  //   parentPath: ctx.router.url(parent, { id: parentId }),
  // });
});

router.get('commentsEdit', '/:id/edit', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(comment.userId))) {
    await ctx.render('comments/edit', {
      comment,
      submitCommentPath: ctx.router.url('commentsUpdate', { id: ctx.params.id }),
      deleteCommentPath: ctx.router.url('commentsDelete', { id: ctx.params.id }),
    });
  }
});

router.patch('commentsUpdate', '/:id', async (ctx) => {
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
        error: validationError,
      });
    }
  }
});

router.delete('commentsDelete', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  console.log(comment);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(comment.userId))) {
    await comment.destroy();
    if (!ctx.request.body.returnPath) {
      ctx.request.body.returnPath = ctx.router.url('comments');
    }
    ctx.redirect(ctx.request.body.returnPath);
  }
});

module.exports = router;
