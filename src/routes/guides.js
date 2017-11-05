const KoaRouter = require('koa-router');
const files = require('./files');
const _ = require('lodash');

const router = new KoaRouter();

router.use('/', async (ctx, next) => {
  ctx.state.submitGuidePath = ctx.router.url('guidesCreate');
  await next();
});

router.get('guides', '/', async (ctx) => {
  let guides = [];
  let filters = [];
  let tag;
  let filter;
  if (ctx.request.query.tagFilter || ctx.request.query.remove) {
    if (ctx.request.query.tagFilter) {
      if (ctx.request.query.oldFilters) {
        filters = _.concat([ctx.request.query.tagFilter], ctx.request.query.oldFilters.split(';'));
      } else {
        filters = [ctx.request.query.tagFilter]
      }
    } else {
      filters = ctx.request.query.oldFilters.split(';');
      _.remove(filters, e => e === ctx.request.query.remove);
    }
  }
  if (filters.length > 0) {
    for (let i = 0; i < filters.length; i += 1) {
      filter = filters[i];
      tag = await ctx.orm.tag.find({ where: { name: filter } });
      if (tag) {
        if (i === 0) {
          guides = await tag.getGuides(
            { include: [ctx.orm.user, ctx.orm.tag] },
          );
          console.log(tag);
          console.log(guides.length);
        } else {
          const newGuides = await tag.getGuides(
            { include: [ctx.orm.user, ctx.orm.tag] },
          );
          guides = _.intersectionBy(guides, newGuides, e => e.id);
          console.log("INTERSECTION ###########");
          console.log(tag);
          console.log(guides.length);
        }
      } else {
        guides = [];
        break;
      }
    }
  } else {
    guides = await ctx.orm.guide.findAll({
      include: [ctx.orm.user, ctx.orm.tag],
    });
  }
  console.log(filters)
  await ctx.render('guides/index', {
    guides,
    filters,
    tags: await ctx.orm.tag.findAll(),
    newGuidePath: ctx.router.url('guidesNew'),
    buildGuideEditPath: id => ctx.router.url('guidesEdit', id),
  });
});

router.get('guidesNew', '/new', async (ctx) => {
  if (!ctx.redirectIfNotLogged()) {
    const guide = await ctx.orm.guide.build();
    await ctx.render('guides/new', {
      guide,
      backToListPath: ctx.router.url('guides'),
      file: await ctx.orm.file.build(),
    });
  }
});

router.post('guidesCreate', '/', async (ctx, next) => {
  if (!ctx.redirectIfNotLogged()) {
    try {
      const guide = await ctx.orm.guide.create(ctx.request.body.fields);
      ctx.request.body.fields.guideId = guide.id;
      await next();
    } catch (validationError) {
      console.log(validationError);
      await ctx.render('guides/new', {
        guide: ctx.orm.guide.build(ctx.request.body),
        backToListPath: ctx.router.url('guides'),
        error: validationError,
      });
    }
  }
});

router.get('guide', '/:id', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id, {
    include: [ctx.orm.tag, ctx.orm.user, ctx.orm.vote, ctx.orm.file, {
      model: ctx.orm.excercise,
      include: [ctx.orm.tag, ctx.orm.user],
    }],
  });
  if (!guide) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
  const owner = await guide.getUser();
  const tagNames = new Set();
  guide.excercises.forEach((excercise) => {
    excercise.tags.forEach((tag) => {
      tagNames.add(tag.name);
    });
  });
  guide.tags.forEach((tag) => {
    tagNames.add(tag.name);
  });
  const guideTags = await ctx.orm.tag.findAll({ where: { name: Array.from(tagNames) } });
  await ctx.render('guides/show', {
    guide,
    editGuidePath: ctx.router.url('guidesEdit', { id: ctx.params.id }),
    deleteGuidePath: ctx.router.url('guidesDelete', { id: ctx.params.id }),
    backToListPath: ctx.router.url('guides'),
    isOwnerOrAdmin: await ctx.isOwnerOrAdmin(owner.id),
    returnPath: ctx.router.url('guide', { id: ctx.params.id }),
    tags: await ctx.orm.tag.findAll(),
    guideTags,
    excercise: await ctx.orm.excercise.build(),
    excercises: guide.excercises,
    buildFileDownloadPath: filename => ctx.router.url('fileDownload', { filename }),
    buildFileDeletePath: id => ctx.router.url('filesDelete', id),
    submitFilePath: ctx.router.url('filesCreate'),
    file: await ctx.orm.file.build(),
    reportCreatePath: ctx.router.url('reportsCreate'),
  });
});

router.get('guidesEdit', '/:id/edit', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(guide.userId))) {
    await ctx.render('guides/edit', {
      guide,
      file: await guide.getFiles()[0],
      submitGuidePath: ctx.router.url('guidesUpdate', { id: ctx.params.id }),
      deleteGuidePath: ctx.router.url('guidesDelete', { id: ctx.params.id }),
      backToListPath: ctx.router.url('guides'),
    });
  }
});

router.patch('guidesUpdate', '/:id', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(guide.userId))) {
    try {
      await guide.update(ctx.request.body);
      ctx.redirect(ctx.router.url('guide', { id: ctx.params.id }));
    } catch (validationError) {
      await guide.set(ctx.request.body);
      await ctx.render('guides/edit', {
        guide,
        submitGuidePath: ctx.router.url('guidesUpdate', { id: ctx.params.id }),
        deleteGuidePath: ctx.router.url('guidesDelete', { id: ctx.params.id }),
        backToListPath: ctx.router.url('guides'),
        error: validationError,
      });
    }
  }
});

router.delete('guidesDelete', '/:id', async (ctx) => {
  const guide = await ctx.orm.guide.findById(ctx.params.id);
  if (!(await ctx.redirectIfNotOwnerOrAdmin(guide.userId))) {
    // await guide.setFiles([]);
    await guide.setTags([]);
    await guide.destroy();
    ctx.redirect(ctx.router.url('guides'));
  }
});

router.use('/', files.routes());

module.exports = router;
