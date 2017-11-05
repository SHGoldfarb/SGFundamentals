const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('vote', '/:resource/:id', async (ctx) => {
  let resource = await ctx.orm[ctx.params.resource].findById(ctx.params.id);
  if (!ctx.redirectIfNotLogged()) {
    const votes = await resource.getVotes({ where: { userId: ctx.state.currentUser.id } });
    const type = ctx.request.body.type === '1' ? true : false
    let create = true;
    if (votes.length > 0) {
      create = false;
      await votes[0].destroy();
      if (votes[0].type !== type) {
        create = true;
      }
    }
    if (create) {
      const vote = await ctx.orm.vote.create({ type });
      await vote.setUser(ctx.state.currentUser);
      await vote.setResource(resource);
    }
  }

  switch (ctx.accepts('html', 'json')) {
    case 'html': {
      let redirect;
      let redirectId;
      switch (ctx.params.resource) {
        case 'comment': {
          const resourceRedirect = () => {
            while (resource._modelOptions.name.singular === 'comment') {
              resource = resource.getParent();
            }
          };
          redirect = resource._modelOptions.name.singular;
          redirectId = resource.id;
          break;
        }
        default:
          redirect = ctx.params.resource;
          redirectId = ctx.params.id;
          break;
      }
      ctx.redirect(ctx.router.url(redirect, { id: redirectId }));
      break;
    }
    case 'json': {
      const responseResource = await ctx.orm[ctx.params.resource].findById(ctx.params.id);
      ctx.body = {
        votes: await responseResource.getVotes(),
      };
      break;
    }
    default:
  }
});

module.exports = router;
