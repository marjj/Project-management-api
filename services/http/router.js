const fs = require('fs')
let router = require('koa-router')()


module.exports = new Promise((resolve, reject) => {
  fs.readdir(`${__dirname}/handlers/`, (err, items) => {
    if (err) {
      reject(err)
    }

    try {
      for (let i = 0; i < items.length; i++) {
        require(`./handlers/${items[i]}`)(router)
      }
    } catch (err) {
      reject(err)
    }

    resolve(router)
  })
})
