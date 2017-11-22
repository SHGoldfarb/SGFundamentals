const KoaRouter = require('koa-router');
const api = require('./routes/api');

const router = new KoaRouter();

/*
 Algolia config
*/
router.use((ctx, next) => {
  ctx.state.algolia = {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_SEARCH_KEY,
    indexName: process.env.ALGOLIA_INDEX,
  };
  return next();
});

router.use(api.routes());

module.exports = router;
