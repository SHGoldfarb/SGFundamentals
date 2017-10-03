const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const excercises = require('./routes/excercises');
const questions = require('./routes/questions');
const comments = require('./routes/comments');
const files = require('./routes/files');

function redirectIfNotLogged(url) {
  if (!this.isLogged) {
    this.redirect(url);
    return true;
  }
  return false;
}

function redirectIfNotAdmin(url) {
  if (this.redirectIfNotLogged(url)) {
    return true;
  }
  if (!this.isAdmin) {
    this.redirect(url);
    return true;
  }
  return false;
}

function redirectIfNotOwnerOrAdmin(url, userId) {
  if (this.redirectIfNotLogged(url)) {
    return true;
  }
  if (!(userId === this.userId) && !this.isAdmin) {
    this.redirect(url);
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
  ctx.state.currentUrl = ctx.url;
  ctx.redirectIfNotLogged = redirectIfNotLogged;
  ctx.redirectIfNotAdmin = redirectIfNotAdmin;
  ctx.redirectIfNotOwnerOrAdmin = redirectIfNotOwnerOrAdmin;
  // Por mientras:
  ctx.isLogged = true;
  ctx.isAdmin = true;
  ctx.userId = 5;
  await next();
});


router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/excercises', excercises.routes());
router.use('/questions', questions.routes());
router.use('/comments', comments.routes());
router.use('/files', files.routes());


module.exports = router;
