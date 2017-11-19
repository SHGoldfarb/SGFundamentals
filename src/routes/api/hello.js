const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('hello', '/', (ctx) => {
  ctx.body = {
    content: 'Hello World!',
  };
});

module.exports = router;
