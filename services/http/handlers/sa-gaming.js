const router = require('koa-router')()

router
  // common middlewares and prefixes here
  .prefix('/sa')

  // add routes here
  .get('/test', async (ctx, next) => {
    ctx.body = 'sa'
    next()
  })

module.exports = router
