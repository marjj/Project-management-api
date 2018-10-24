const router = require('koa-router')()
const bcrypt = require('bcrypt-nodejs')
const { user } = require('../../../store/user')

router
  // common middlewares and prefixes here
  .prefix('/users')

  // add routes here
  .post('/create', async (ctx, next) => {
    var body = ctx.request.body

    var hash = bcrypt.hashSync(body.password);

    var u = new user({
      name: body.fullname,
      user_name: body.username,
      authority: body.authority,
      type: body.type,
      login: false,
      password: hash
    })
    
    var cmd = await u.save()
    
    ctx.body = u

    next()
  })

  .get('/all', async (ctx, next) => {
    ctx.body = ctx.request.body
    var u = await user.find( {}, null, {sort: {'_id': - 1} } )
    ctx.body = u
    next()
  })

module.exports = router
