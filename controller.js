const fs = require('fs')
const ejs = require('ejs')
const os = require('os');
const path = require('path');
const model = require('./model')
const push = require('./push')
const errorView = fs.readFileSync(__dirname + '/views/error.html')
const homeView = fs.readFileSync(__dirname + '/views/home.html')
const pushView = fs.readFileSync(__dirname + '/views/push.ejs', { encoding: 'utf-8' })
const searchView = fs.readFileSync(__dirname + '/views/search.ejs', { encoding: 'utf-8' })

module.exports = {
  async error (ctx, next) {
    try { await next() } catch (err) {
      console.log(err)
      ctx.type = 'text/html'
      ctx.body = errorView
    }
  },
  async home (ctx) {
    ctx.type = 'text/html'
    ctx.body = homeView
  },
  async search (ctx) {
    const list = await model.getList(ctx.query.q)
    ctx.body = ejs.render(searchView, { query: ctx.query.q, list })
  },
  async p (ctx) {
    const url = await model.getUrl(ctx.query.i)
    const err = await push(url)
    ctx.body = ejs.render(pushView, { err })
  },
  async upload (ctx, next) {
      // ignore non-POSTs
      if ('POST' != ctx.method) return await next();

      const file = ctx.request.body.files.file;
      const reader = fs.createReadStream(file.path);
      const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
      reader.pipe(stream);
      console.log('uploading %s -> %s', file.name, stream.path);

      ctx.body = JSON.stringify({
          'origin': file.name,
          'filename': stream.path
      });
  },
  async pushlocal (ctx) {
      const url = ctx.query.i
      const err = await push(url)
      ctx.body = JSON.stringify({
          'msg': err
      });
  }
}