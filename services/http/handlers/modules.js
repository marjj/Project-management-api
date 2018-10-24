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
                      .populate({
                        path: 'modules',
                        populate: { 
                          path:'task',
                          populate: [{path: 'created_by'}, {path: 'done_by'}],
                          options: { sort: { '_id' : -1 } }
                        },
                        options: { sort: { '_id' : -1 } }
                      })

    next()
  })

module.exports = router