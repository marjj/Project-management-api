const router = require('koa-router')()
const project = require('../../../store/projects')

router
  // common middlewares and prefixes here
  .prefix('/project')

  // add routes here
  .post('/create', async (ctx, next) => {
    console.log(ctx.request.body);
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
      ctx.body = await project.find({})
    }
    next()
  })

  .get('/all', async (ctx, next) => {
    ctx.body = []

    var proj = await project.find({})
    ctx.body = proj

    next()
  })

module.exports = router
