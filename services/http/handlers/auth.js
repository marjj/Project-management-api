const router = require('koa-router')()
const { user } = require('../../../store/user')

router
  // common middlewares and prefixes here
  .prefix('/auth')

  .post('/login', async (ctx, next) => {
    var body = ctx.request.body
    ctx.body = 'error'
    var u = await user.find({_id: body.user._id})

    if(u.length && u[0].password !== body.password) {
      next()
      return 
    }

    user.updateMany({}, {$set: {login: false} }, {multi: true})
    var check = await user.updateOne({_id : body.user._id}, {$set: {login: true} }) 
    if(check.nModified) {
      ctx.body = 'success'
    }
    next()
  })

  .post('/logout', async (ctx, next) => {
    ctx.body = 'error'

    var check = await user.updateMany({}, {login: false}, {multi: true})
    if(check.nModified) {
      ctx.body = 'success'
    }
    next()
  })

module.exports = router