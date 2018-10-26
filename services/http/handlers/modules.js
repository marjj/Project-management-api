const router = require('koa-router')()
const { project, modules } = require('../../../store/project')

router
  .prefix('/module')
  .post('/create', async (ctx, next) => {
    var data = ctx.request.body

    var mod = new modules({
      project: data.selected._id,
      name: data.title,
      user_group: data.assigned,
      created_by: data.created_by,
      created_at: data.created_at,
      deleted: false
    })

    var cmd = await mod.save()
    ctx.body = cmd

    await project.updateMany( { _id: data.selected._id },
                                    { $push: { modules:cmd._id } } )

    ctx.body = await project.find({_id: data.selected._id})
      .populate( {
        path: 'modules',
        options: {
          sort: { _id: -1 },
          where: { deleted: false } 
        },
        populate: { 
          path:'task',
          options: {
            sort:{ '_id' : -1 } }
          },
          populate: [
            {
              path: 'created_by'
            },
            {
              path: 'done_by'
            }
          ]
      } )

    next()
  })

  .post('/update', async (ctx, next) => {

    var data = ctx.request.body

    await modules.updateOne({_id: data._id}, {$set: {name: data.name } } )
    
    ctx.body = data

    next()
  })

  .post('/delete', async (ctx, next) => {
    
    var data = ctx.request.body

    let response = await modules.updateOne({_id: data._id}, {$set: {deleted: true } } )

    let request = await modules.findOne({_id: data._id})

    ctx.body = request

    next()
  })

module.exports = router