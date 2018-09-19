const Router = require('koa-router')
module.exports = (config) => {
  const router = new Router(config)
  router.get('/sitemap')
}
