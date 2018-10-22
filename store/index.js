/**
 * Bootstrap database and redis connections here
 */

 // start connections
const mysql = require('../utilities/mysql')
const redis = require('../utilities/redis')
const mongo = require('../utilities/mongo')

const convert = (obj) => {
  let result = []
  for (const key in obj) {
    result = result.concat([key, obj[key]])
  }

  return result
}

module.exports = {
  mysql,
  redis,
  mongo,
 /**
  * Kick start all connections
  *
  * @return {Void}
  */
  start () {
    mongo.connect()
  },

  /**
   * Store cache
   *
   * @return {Promise}
   */
  async cache (key, params) {
    return this.redis.client.hmsetAsync(key, convert(params))
  },

  /**
   * Finds stale cache with key if it does not exist then execute callback
   * and store result
   *
   * @return {Promise} stale Returns stale cache or fresh result
   */
  async read (key, callback) {
    let result = await this.redis.client.hgetAsync(key)
    let cbResult = null

    if (!result) {
      cbResult = await callback()
    }

    if (cbResult) {
      this.cache(key, cbResult)
      result = cbResult
    }

    return result
  }
 }
