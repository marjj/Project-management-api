const router = require('koa-router')()
const { project, modules, task } = require('../../../store/project')

router
  .prefix('/task')
  .post('/create', async (ctx, next) => {
    var data = ctx.request.body


    var ta = new task({
      module: data.module._id,
      title: data.title,
      description: data.description, 
      deadline: data.deadline,
      start_date: data.startdate,
      created_by: data.created_by,
      created_at: data.created_at
    })


    var cmd = await ta.save()

    await modules.updateMany( { _id: ta.module },
                              { $push: { task: ta._id } 
                            } )

    ctx.body = await modules.find( { _id: ta.module } )
                            .populate( { path: 'task' ,
                                         populate: [{path: 'created_by'}, {path: 'done_by'}],
                                         options: { sort: { '_id': -1 } }
                                      } )

    next()
  })

  .post('/done', async (ctx, next) => {

    var request = ctx.request.body

    var query = await task.updateMany({ _id: request._id }, 
      { $set: {'done': true, done_by: request.done_by } })

    ctx.body = await modules.find({ _id: request.module })
                  .populate( {
                      path: 'task',
                      populate: [{path: 'created_by'}, {path: 'done_by'}]
                    }
                  )

    next()
  })

module.exports = router