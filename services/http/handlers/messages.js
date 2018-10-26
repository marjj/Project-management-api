const router = require('koa-router')()
const { message, thread, sub_thread } = require('../../../store/freeboard')

var _populate_sub_threads = [ { path:'created_by'} ] 
var _popupate_threads = [
  {
    path:'created_by'
  },
  {
    path:'sub_threads', 
    populate: _populate_sub_threads,
    options: { sort: { 'created_at' : -1 } }
  }
]

var _popupate_message = [
  {
    path:'created_by'
  },
  {
    path:'threads',
    populate: _popupate_threads,
    options: { sort: {'created_at' : -1 } }
  }
];

router
  .prefix('/message')
  
  .get('/all', async (ctx, next) => {

    ctx.body = await message.find({}, null, {sort: {'created_at' : -1 } } )
               .populate(_popupate_message)
    next()
  })

  .post('/create', async (ctx, next) => {
    var data = ctx.request.body

    var query = new message({
      subject: data.subject,
      content: data.content,
      created_by: data.created_by,
      file: data.file
    })

    await query.save()

    ctx.body = await message.find( { _id: query._id })
                          .populate( { path: 'created_by' } )
    
    next()
  })

  .post('/reply', async (ctx, next) => {
    var data = ctx.request.body

    var query = new thread({
      content: data.content,
      message: data.message,
      created_by: data.created_by,
      deleted: false
    })

    await query.save()

    await message.updateMany( { _id: query.message },
                                    { $push: { threads: query._id } } )

    let result = await message.find( { _id: query.message }, null, {sort: {'created_at' : -1 } } )
               .populate(_popupate_message)

    ctx.body = result

    next()
  })

  .post('/thread/reply', async (ctx, next) => {
    var data = ctx.request.body

    var query = new sub_thread({
      content: data.content,
      created_by: data.created_by,
      thread: data.thread
    })

    await query.save()

    
    await thread.updateMany( { _id: query.thread }, {$push: {sub_threads: query._id} } )

    let result = await thread.find( { _id: query.thread })
      .populate(_popupate_threads)

    ctx.body = result
    next()
  })

module.exports = router