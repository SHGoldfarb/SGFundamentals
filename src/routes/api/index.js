const KoaRouter = require('koa-router');
const questions = require('./questions');

const router = new KoaRouter();

router.use('/questions', questions.routes());

module.exports = router;
