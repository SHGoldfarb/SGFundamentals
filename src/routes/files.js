const KoaRouter = require('koa-router');
const fileStorage = require('../services/file-storage');
const _ = require('lodash');

const router = new KoaRouter();

router.use('/', async (ctx, next) => {
  ctx.state.submitFilePath = ctx.router.url('filesCreate');
  await next();
});


router.get('files', '/', async (ctx) => {
  throw new Error('Not Found');
  // const files = await ctx.orm.file.findAll();
  // await ctx.render('files/index', {
  //   files,
  //   newFilePath: ctx.router.url('filesNew'),
  //   buildFilePath: id => ctx.router.url('file', id),
  //   buildFileEditPath: id => ctx.router.url('filesEdit', id),
  //   buildFileDeletePath: id => ctx.router.url('filesDelete', id),
  // });
});

router.get('filesNew', '/new', async (ctx) => {
  throw new Error('Not Found');
  // if (!ctx.redirectIfNotLogged()) {
  //   const file = await ctx.orm.file.build();
  //   await ctx.render('files/new', {
  //     file,
  //     backToListPath: ctx.router.url('files'),
  //   });
  // }
});

router.post('filesCreate', '/', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    try {
      const uploads = ctx.request.body.files.file;
      const filename = uploads.name.substr(0, uploads.name.length - 4);
      const ext = uploads.name.substr(uploads.name.length - 4);
      uploads.name = _.camelCase(_.deburr(filename)) + ext;
      await fileStorage.upload(uploads);
      const file = await ctx.orm.file.create({
        ...ctx.request.body.fields,
        filename: uploads.name,
      });
      file.setUser(ctx.state.currentUser);
      ctx.redirect(ctx.router.url('guide', { id: ctx.request.body.fields.guideId }));
      console.log('FILE CREATION SUCCESSFULL');
    } catch (validationError) {
      console.log('FILE CREATION FAILED');
      throw validationError;
      // await ctx.render('files/new', {
      //   file: ctx.orm.file.build(ctx.request.body),
      //   backToListPath: ctx.router.url('files'),
      //   error: validationError,
      // });
    }
  }
});

router.get('file', '/:id', async (ctx) => {
  throw new Error('Not Found');
  // const file = await ctx.orm.file.findById(ctx.params.id);
  // if (!file) {
  //   ctx.status = 404;
  //   throw new Error('Not Found');
  // }
  // const owner = await file.getUser();
  // await ctx.render('files/show', {
  //   file,
  //   editFilePath: ctx.router.url('filesEdit', { id: ctx.params.id }),
  //   deleteFilePath: ctx.router.url('filesDelete', { id: ctx.params.id }),
  //   backToListPath: ctx.router.url('files'),
  //   isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
  //   returnPath: ctx.router.url('file', { id: ctx.params.id }),
  //   tags: await file.getTags(),
  //   downloadPath: ctx.router.url('fileDownload', { filename: file.filename }),
  // });
});

router.get('filesEdit', '/:id/edit', async (ctx) => {
  throw new Error('Not Found');
  // const file = await ctx.orm.file.findById(ctx.params.id);
  // if (!(await ctx.redirectIfNotOwnerOrAdmin(file.userId))) {
  //   await ctx.render('files/edit', {
  //     file,
  //     submitFilePath: ctx.router.url('filesUpdate', { id: ctx.params.id }),
  //     deleteFilePath: ctx.router.url('filesDelete', { id: ctx.params.id }),
  //     backToListPath: ctx.router.url('files'),
  //   });
  // }
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

router.get('fileDownload', '/download/:filename', async (ctx) => {
  ctx.body = await fileStorage.download(ctx.params.filename);
  ctx.response.type = 'application/pdf';
});

module.exports = router;
