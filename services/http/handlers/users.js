const router = require('koa-router')()
const bcrypt = require('bcrypt-nodejs')
const { user } = require('../../../store/user')

router
  // common middlewares and prefixes here
  .prefix('/users')

  // add routes here
  .post('/create', async (ctx, next) => {
    var data = ctx.request.body

    var hash = bcrypt.hashSync(data.password);

    var check = await user.find({user_name: data.username}, null, { where: { deleted: false} } )
    
    if(check.length) {
      return ctx.body = 'duplicate user'
    }

    var query = new user({
      name: data.fullname,
      user_name: data.username,
      authority: data.authority,
      type: data.type,
      login: false,
      password: hash
    })
    
    await query.save()
    
    ctx.body = query

    next()
  })

  .get('/all', async (ctx, next) => {
    ctx.body = ctx.request.body
    var u = await user.find( {}, null, { sort: {'_id': - 1}, where: {deleted: false } } )
    ctx.body = u
    next()
  })

  .post('/update', async (ctx, next) => {
    var data = ctx.request.body

    let avatar = data.avatar === undefined ? data.user.avatar : data.avatar 
    let name = data.user.name === undefined ? '' : data.user.name 
    let user_name = data.user.user_name === undefined ? '' : data.user.user_name 
    let type = data.user.type === undefined ? '' : data.user.type 
    let authority = data.user.authority === undefined ? '' : data.user.authority 

    var request = await user.updateOne( {_id: data.user._id},
      { $set: { avatar, name, user_name, type, authority }
    })
    
    ctx.body = request
    
    next()
  })

  .post('/delete', async (ctx, next) => {
    var  data = ctx.request.body

    var query = await user.updateOne( { _id : data._id },
        { $set: {deleted: true } }
      )
    ctx.body = data
    next()
  })

module.exports = router
