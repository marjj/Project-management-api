const router = require('koa-router')()
const user = require('../../../store/user')

router
  // common middlewares and prefixes here
  .prefix('/users')

  // add routes here
  .get('/create', async (ctx, next) => {
    ctx.body = user.create({username: 'jodan12'})
    next()
  })

module.exports = router
