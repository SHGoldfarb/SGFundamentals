const KoaRouter = require('koa-router');
const hello = require('./hello');

const router = new KoaRouter();

router.use('/hello', hello.routes());

module.exports = router;
