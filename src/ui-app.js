const Koa = require('koa');
const koaFlashMessage = require('koa-flash-message').default;
const koaStatic = require('koa-static');
const override = require('koa-override-method');
const routes = require('./routes');
const path = require('path');

// App constructor
const app = new Koa();

const developmentMode = app.env === 'development';

// webpack middleware for dev mode only
if (developmentMode) {
  /* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
  app.use(require('koa-webpack')({ // eslint-disable-line global-require
    dev: {
      index: 'index.html',
      stats: {
        colors: true,
      },
    },
    hot: false,
  }));
}


app.use(koaStatic(path.join(__dirname, '..', 'build'), {}));

// flash messages support
app.use(koaFlashMessage);

app.use((ctx, next) => {
  ctx.request.method = override.call(ctx, ctx.request.body);
  return next();
});

app.use(routes.routes());

module.exports = app;
