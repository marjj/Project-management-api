const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser')
module.exports = async () => {
  const router = await require('./router')

  app.use(bodyParser({
    enableTypes: ['json', 'text']
  }))
  app.use(cors())
  app.use(router.allowedMethods())
  app.use(router.routes())
  app.listen(process.env.PORT || '4000')
  console.log(`Listening on port ${process.env.PORT || 4000}`)
  return app
}
