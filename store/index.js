/**
 * Bootstrap database and redis connections here
 */

 const mysql = require('../utilities/mysql')
 const redis = require('../utilities/redis')

// start connections


module.exports = {
 /**
  * Kick start all connections
  *
  * @return {Void}
  */
  start () {
    mysql.connect()
    redis.connect()
  },
  database: mysql,
  cache: redis
 }
