const fs = require('fs')
const koaRouter = require('koa-router')


module.exports = new Promise((resolve, reject) => {
  let router = koaRouter()

  fs.readdir(`${__dirname}/handlers/`, (err, items) => {
    if (err) {
      reject(err)
    }

    try {
      for (let i = 0; i < items.length; i++) {
        router.use(require(`./handlers/${items[i]}`).routes())
      }
    } catch (err) {
      reject(err)
    }

    resolve(router)
  })
})
