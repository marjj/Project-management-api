const router = require('koa-router')()
const { user } = require('../../../store/user')

router
  // common middlewares and prefixes here
  .prefix('/users')

  // add routes here
  .post('/create', async (ctx, next) => {
    var body = ctx.request.body

    var u = new user({
      name: body.fullname,
      user_name: body.username,
      authority: body.authority,
      type: body.type,
      login: false,
      password: body.password
    })
    var cmd = await u.save()
    ctx.body = cmd
    next()
  })

  .get('/all', async (ctx, next) => {
    ctx.body = ctx.request.body
    var u = await user.find({})
    ctx.body = u
    next()
  })

module.exports = router
