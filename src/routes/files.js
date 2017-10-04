const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('files', '/', async (ctx) => {
  const files = await ctx.orm.file.findAll();
  await ctx.render('files/index', {
    files,
    newFilePath: ctx.router.url('filesNew'),
    buildFilePath: id => ctx.router.url('file', id),
    buildFileEditPath: id => ctx.router.url('filesEdit', id),
    buildFileDeletePath: id => ctx.router.url('filesDelete', id),
  });
});

router.get('filesNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    const file = await ctx.orm.file.build();
    await ctx.render('files/new', {
      file,
      submitFilePath: ctx.router.url('filesCreate'),
      backToListPath: ctx.router.url('files'),
    });
  }
});

router.post('filesCreate', '/', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    try {
      const file = await ctx.orm.file.create(ctx.request.body);
      ctx.redirect(ctx.router.url('file', { id: file.id }));
    } catch (validationError) {
      await ctx.render('files/new', {
        file: ctx.orm.file.build(ctx.request.body),
        submitFilePath: ctx.router.url('filesCreate'),
        backToListPath: ctx.router.url('files'),
        error: validationError,
      });
    }
  }
});

router.get('file', '/:id', async (ctx) => {
  const file = await ctx.orm.file.findById(ctx.params.id);
  const owner = await file.getUser();
  await ctx.render('files/show', {
    file,
    editFilePath: ctx.router.url('filesEdit', { id: ctx.params.id }),
    deleteFilePath: ctx.router.url('filesDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('files'),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    returnPath: ctx.router.url('file', { id: ctx.params.id }),
    tags: await file.getTags(),
    createTagPath: ctx.router.url('tagsCreate'),
    buildTagDeletePath: id => ctx.router.url('tagsDelete', { id }),
  });
});

router.get('filesEdit', '/:id/edit', async (ctx) => {
  const file = await ctx.orm.file.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(file.userId))) {
    await ctx.render('files/edit', {
      file,
      submitFilePath: ctx.router.url('filesUpdate', { id: ctx.params.id }),
      deleteFilePath: ctx.router.url('filesDelete', { id: ctx.params.id }),
      backToListPath: ctx.router.url('files'),
    });
  }
});

router.patch('filesUpdate', '/:id', async (ctx) => {
  const file = await ctx.orm.file.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(file.userId))) {
    try {
      await file.update(ctx.request.body);
      ctx.redirect(ctx.router.url('file', { id: ctx.params.id }));
    } catch (validationError) {
      await file.set(ctx.request.body);
      await ctx.render('files/edit', {
        file,
        submitFilePath: ctx.router.url('filesUpdate', { id: ctx.params.id }),
        deleteFilePath: ctx.router.url('filesDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('files'),
        error: validationError,
      });
    }
  }
});

router.delete('filesDelete', '/:id', async (ctx) => {
  const file = await ctx.orm.file.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(file.userId))) {
    await file.destroy();
    ctx.redirect(ctx.router.url('files'));
  }
});

module.exports = router;
