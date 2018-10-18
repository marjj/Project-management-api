const store = require('./index')

module.exports = {
  /**
   * Create new user
   *
   * @param  {User} params User to save
   * @return {Promise<Object>} Promise object
   */
  async create (params) {
    let columns = []
    let values = []

    for (const key in params) {
      columns.push(key)
      values.push(params[key])
    }

    params.id = (await store.mysql.insert('users', columns, [values])).insertId

    await store.cache(`users:${params.id}`, params)
    return params
  },

  /**
   * Update user information
   *
   * @param  {Object}  params columns to update
   * @return {Promise<Object>} Promise object
   */
  async update (params, where) {

  }
}
