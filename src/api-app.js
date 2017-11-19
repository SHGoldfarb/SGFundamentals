const Koa = require('koa');
const routes = require('./api-routes.js');

// App constructor
const app = new Koa();

// Routing Middleware
app.use(routes.routes());

module.exports = app;
