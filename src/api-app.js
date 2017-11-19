const Koa = require('koa');
const routes = require('./api-routes.js');
const jsonApiSerializer = require('jsonapi-serializer');

// App constructor
const app = new Koa();

app.use((ctx, next) => {
  ctx.jsonSerializer = function jsonSerializer(type, options) {
    return new jsonApiSerializer.Serializer(type, options);
  };
  return next();
});

// Routing Middleware
app.use(routes.routes());


module.exports = app;
