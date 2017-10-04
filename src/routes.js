const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const excercises = require('./routes/excercises');
const questions = require('./routes/questions');
const comments = require('./routes/comments');
const files = require('./routes/files');
const sessions = require('./routes/session');
const tags = require('./routes/tags');

function isLogged() {
  return !!this.state.currentUser;
}

function redirectIfNotLogged() {
  if (!this.isLogged()) {
    this.redirect(this.router.url('/'));
    return true;
  }
  return false;
}

function redirectIfLogged(url) {
  if (this.isLogged()) {
    this.redirect(url);
    return true;
  }
  return false;
}

async function isAdmin() {
  return this.isLogged() && this.state.currentUser.isAdmin();
}

async function redirectIfNotAdmin() {
  if (!(await this.isAdmin())) {
    this.redirect(this.router.url('/'));
    return true;
  }
  return false;
}

function isOwner(id) {
  return this.isLogged() && this.state.currentUser.id === id;
}

async function isOwnerOrAdmin(id) {
  return this.isOwner(id) || this.isAdmin();
}

async function redirectIfNotOwnerOrAdmin(userId) {
  if (!await this.isOwnerOrAdmin(userId)) {
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
  ctx.state.tagsPath = router.url('tags');
  ctx.state.signInPath = router.url('sessionNew');
  ctx.state.signOutPath = router.url('sessionDestroy');
  ctx.state.signUpPath = router.url('usersNew');
  ctx.state.currentUrl = ctx.url;
  ctx.state.currentUser = ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId);
  ctx.redirectIfNotLogged = redirectIfNotLogged;
  ctx.redirectIfLogged = redirectIfLogged;
  ctx.redirectIfNotAdmin = redirectIfNotAdmin;
  ctx.redirectIfNotOwnerOrAdmin = redirectIfNotOwnerOrAdmin;
  ctx.isLogged = isLogged;
  ctx.isAdmin = isAdmin;
  ctx.isOwner = isOwner;
  ctx.isOwnerOrAdmin = isOwnerOrAdmin;
  ctx.state.isLogged = ctx.isLogged();
  ctx.state.isAdmin = await ctx.isAdmin();
  await next();
});


router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/excercises', excercises.routes());
router.use('/questions', questions.routes());
router.use('/comments', comments.routes());
router.use('/files', files.routes());
router.use('/tags', tags.routes());
router.use('/', sessions.routes());


module.exports = router;
