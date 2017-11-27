const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const render = require('koa-ejs');
const orm = require('./models');
const mailer = require('./mailers');
const mount = require('koa-mount');
const session = require('koa-session');
const path = require('path');
const apiApp = require('./api-app');
const uiApp = require('./ui-app');
const algoliasearch = require('./algoliasearch');

// App constructor
const app = new Koa();

const developmentMode = app.env === 'development';

// expose ORM through context's prototype
app.context.orm = orm;

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const commentIndex = client.initIndex(`${process.env.ALGOLIA_INDEX}-comment`);
const questionIndex = client.initIndex(`${process.env.ALGOLIA_INDEX}-question`);
const guideIndex = client.initIndex(`${process.env.ALGOLIA_INDEX}-guide`);
const excerciseIndex = client.initIndex(`${process.env.ALGOLIA_INDEX}-excercise`);
const algoliaIndex = client.initIndex(process.env.ALGOLIA_INDEX);

app.context.commentIndex = commentIndex;
app.context.questionIndex = questionIndex;
app.context.excerciseIndex = excerciseIndex;
app.context.guideIndex = guideIndex;
app.context.algoliaIndex = algoliaIndex;

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  'saying he is logged in when it\'s really not',
];

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env;
  return next();
});

// log requests
app.use(koaLogger());

// parse request body
app.use(koaBody({
  multipart: true,
  keepExtensions: true,
}));

// expose a session hash to store information across requests from same client
app.use(session({
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
}, app));

mailer(app);

// Configure EJS views
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'html.ejs',
  cache: !developmentMode,
});

app.use(mount('/api/v1', apiApp));
app.use(mount(uiApp));

console.log(app);

module.exports = app;
