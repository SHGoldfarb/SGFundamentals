const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const questions = require('./questions');
const session = require('./session');

const router = new KoaRouter();

router.use('/session', session.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findById(ctx.state.authData.userId);
  }
  return next();
});
router.use('/questions', questions.routes());

module.exports = router;
