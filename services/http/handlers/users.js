const router = require('koa-router')()

router
  // common middlewares and prefixes here
  .prefix('/users')

  // add routes here
  .get('/create', async (ctx, next) => {
    ctx.body = 123
  })

module.exports = router
