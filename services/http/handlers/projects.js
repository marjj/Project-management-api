const router = require('koa-router')()
const { project } = require('../../../store/project')

router
  // common middlewares and prefixes here
  .prefix('/project')

  // add routes here
  .post('/create', async (ctx, next) => {
    var data = ctx.request.body

    var proj = new project({
      name: data.title, 
      deadline: data.deadline,
      created_at: data.created_at,
      start_date: data.startdate,
      created_by: data.user_id,
      user_group: data.group
    })

    var cmd = await proj.save()

    if(cmd) {
      ctx.body = proj
    }
    next()
  })

  .get('/all', async (ctx, next) => {
    ctx.body = []

    var proj = await project.find( {}, null, { sort: { '_id': -1 } } )
                    .populate([{ path: 'modules',
                      options: { sort : {'_id': -1}, },
                      populate: { path:'task',
                        populate: [{path: 'created_by'}, {path: 'done_by'}],
                        options: { sort: { '_id' : -1 } }
                      }
                    }, { path: 'created_by' } ] )

    ctx.body = proj

    next()
  })

  .post('/update', async (ctx, next) => {
    var data = ctx.request.body

    var query = await project.updateOne( { _id: data.project._id },
                                    { $set: { user_group: data.users } })

    ctx.body = query

    next()
  })
module.exports = router
