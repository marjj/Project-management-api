const router = require('koa-router')()
const bcrypt = require('bcrypt-nodejs')
const { user } = require('../../../store/user')

router
  // common middlewares and prefixes here
  .prefix('/auth')

  .post('/login', async (ctx, next) => {
    var data = ctx.request.body
    ctx.body = data
    var request = await user.findOne({_id: data.user._id})

    var compare = bcrypt.compareSync(data.password, request.password); // true

    if(Object.keys(request).length) {

      if(!compare) {
        ctx.body = 'wrong password'
        return 
      }

      if(request.login) {
        ctx.body = 'Already logged in'  
        return 
      }

    }

    var query = await user.updateOne({_id : data.user._id}, {$set: {login: true} }) 

    if(query.ok) {
      ctx.body = await user.findOne( {_id : data.user._id } )
    }
    next()
  })

  .post('/logout', async (ctx, next) => {
    ctx.body = 'error'

    var query = await user.updateMany({}, {login: false}, {multi: true})
    if(query.ok) {
      ctx.body = 'success'
    }
    next()
  })

module.exports = router