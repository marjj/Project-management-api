/**
 * Application starting point
 * Boostrap services here
 */

const cluster = require('cluster')
const cpus = require('os').cpus().length
require('dotenv').config()

if (cluster.isMaster) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
} else {
  require('./store').start()
  require('./services')()
    .then(() => { console.info(`Services loaded | PID ${process.pid}`)})
    .catch(console.error)
}
