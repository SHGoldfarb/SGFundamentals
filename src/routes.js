const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const excercises = require('./routes/excercises');
const questions = require('./routes/questions');
const comments = require('./routes/comments');
const files = require('./routes/files');
const sessions = require('./routes/session');

function redirectIfNotLogged() {
  if (!this.state.currentUser) {
    this.redirect(this.router.url('/'));
    return true;
  }
  return false;
}

async function redirectIfNotAdmin() {
  if (this.redirectIfNotLogged()) {
    return true;
  }
  if (!(await this.state.currentUser.isAdmin())) {
    this.redirect(this.router.url('/'));
    return true;
  }
  return false;
}

async function redirectIfNotOwnerOrAdmin(userId) {
  if (this.redirectIfNotLogged()) {
    return true;
  }
  if (!(userId === this.state.currentUser.id) && !(await this.state.currentUser.isAdmin())) {
    this.redirect(this.router.url('/'));
    return true;
  }
  return false;
}

const router = new KoaRouter();
router.use('/', async (ctx, next) => {
  ctx.state.excercisesPath = router.url('excercises');
  ctx.state.questionsPath = router.url('questions');
  ctx.state.commentsPath = router.url('comments');
  ctx.state.usersPath = router.url('users');
  ctx.state.filesPath = router.url('files');
  ctx.state.signInPath = router.url('sessionNew');
  ctx.state.signOutPath = router.url('sessionDestroy');
  ctx.state.signUpPath = router.url('usersNew');
  ctx.state.currentUrl = ctx.url;
  ctx.redirectIfNotLogged = redirectIfNotLogged;
  ctx.redirectIfNotAdmin = redirectIfNotAdmin;
  ctx.redirectIfNotOwnerOrAdmin = redirectIfNotOwnerOrAdmin;
  // Por mientras:
  ctx.isLogged = true;
  ctx.isAdmin = true;
  ctx.userId = 5;
  ctx.state.currentUser = ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId);
  ctx.state.currentUrl = ctx.url;
  await next();
});


router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/excercises', excercises.routes());
router.use('/questions', questions.routes());
router.use('/comments', comments.routes());
router.use('/files', files.routes());
router.use('/', sessions.routes());


module.exports = router;
