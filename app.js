const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body');
const logger = require('koa-logger');
const router = require('./router')
var staticServer = require("koa-static");
app.use(logger());
app.use(koaBody({ multipart: true }))
app.use(router)
app.use(staticServer(__dirname + "/static"))

if (module.parent) module.exports = app
else {
  const config = require('./config')
  app.listen(config.port)
}