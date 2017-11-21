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
const guides = require('./routes/guides');
const votes = require('./routes/votes');
const search = require('./routes/search');
const profile = require('./routes/profile');
const reports = require('./routes/reports');
const _ = require('lodash');

function isLogged() {
  return !!this.state.currentUser;
}

function redirectIfNotLogged() {
  if (!this.isLogged()) {
    this.status = 401;
    throw new Error('Unauthorized');
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
    throw new Error('Unauthorized');
    // return true;
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
    this.status = 401;
    throw new Error('Unauthorized');
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
  ctx.state.guidesPath = router.url('guides');
  ctx.state.signInPath = router.url('sessionNew');
  ctx.state.signOutPath = router.url('sessionDestroy');
  ctx.state.signUpPath = router.url('usersNew');
  ctx.state.searchPath = router.url('search');
  ctx.state.profilePath = router.url('profile');
  ctx.state.reportsPath = router.url('reports');
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
  ctx.state.isOwner = function _isOwner(id) {
    return ctx.isOwner(id);
  };
  ctx.state._ = _;
  ctx.state.buildVotePath = (resource, id) => ctx.router.url('vote', { resource, id });
  try {
    await next();
  } catch (err) {
    console.log('Catched error:');
    console.log(err.stack);
    if (err.message === 'Not Found') {
      ctx.status = 404;
      ctx.state.message = ctx.customErrorMessage;
      await ctx.render('errors/404');
    } else if (err.message === 'Unauthorized') {
      ctx.status = 401;
      ctx.state.message = ctx.customErrorMessage;
      await ctx.render('errors/401');
    } else {
      throw err;
    }
  }
});

router.use('/', async (ctx, next) => {
  switch (ctx.accepts('html', 'json')) {
    case 'json':
      if (Object.keys(ctx.request.body).length > 0) {
        ctx.request.body = JSON.parse(ctx.request.body);
      }
      break;
    default:
  }
  ctx.state.newCommentPath = ctx.router.url('commentsNew');
  ctx.state.createCommentPath = ctx.router.url('commentsCreate');
  ctx.state.buildCommentPath = function foo(id) { return ctx.router.url('comment', { id }); };
  ctx.state.buildCommentEditPath = function foo(id) { return ctx.router.url('commentsEdit', { id }); };
  ctx.state.buildCommentDeletePath = function foo(id) { return ctx.router.url('commentsDelete', { id }); };
  ctx.state.buildUserPath = function foo(id) { return ctx.router.url('user', { id }); };
  ctx.state.buildQuestionPath = function foo(id) { return ctx.router.url('question', { id }); };
  ctx.state.submitExcercisePath = ctx.router.url('excercisesCreate');
  ctx.state.buildExcercisePath = function foo(id) { return ctx.router.url('excercise', { id }); };
  ctx.state.buildExcerciseEditPath = function foo(id) { return ctx.router.url('excercisesEdit', { id }); };
  ctx.state.buildExcerciseDeletePath = function foo(id) { return ctx.router.url('excercisesDelete', { id }); };
  ctx.state.buildGuidePath = function foo(id) { return ctx.router.url('guide', { id }); };
  ctx.state.createTagPath = ctx.router.url('tagsCreate');
  ctx.state.buildTagUnsetPath = function foo(id) { return ctx.router.url('tagsUnset', { id }); };
  await next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/excercises', excercises.routes());
router.use('/questions', questions.routes());
router.use('/comments', comments.routes());
// router.use('/files', files.routes());
router.use('/tags', tags.routes());
router.use('/guides', guides.routes());
router.use('/vote', votes.routes());
router.use('/search', search.routes());
router.use('/profile', profile.routes());
router.use('/reports', reports.routes());
router.use('/', sessions.routes());


router.all(/^\/(.*)(?:\/|$)/, async (ctx, next) => {
  // So router middleware is loaded even if url doesnt exist
  // This is necesary to render the not found page
  ctx.status = 404;
  console.log(ctx.url);
  console.log(ctx.request.body);
  throw new Error('Not Found');
});

module.exports = router;
