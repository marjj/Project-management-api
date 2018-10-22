const router = require('koa-router')()

router
  // common middlewares and prefixes here
  .prefix('/sa')

  // add routes here
  .get('/test', async (ctx, next) => {
    ctx.body = '123'
    next()
  })

module.exports = router
