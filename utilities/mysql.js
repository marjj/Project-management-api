const mysql = require('mysql')
const _ = require('lodash')

module.exports = {
  pool: null,

  connectPool () {
    this.pool = mysql.createPool({
      multipleStatements: true,
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      port: process.env.DB_PORT || 3306,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    })
  },

  /**
   * Get connection from pool
   *
   * @returns {Promise}
   */
  connect () {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err)
        }

        resolve(connection)
      })
    })
  },

  /**
   * Execute Query
   *
   * @param query
   * @param params
   * @returns {Promise}
   */
  async query (query, params = []) {
    let connection = await this.connect()
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(data)
      })

      connection.release()
    })
  },

  async insert (table, columns, values = []) {
    let cols = new Array(columns.length)
    cols.fill('??')

    return this.query(`insert into ${table} (${cols.join(',')}) values ?`, columns.concat([values]))
  },

  async update (table, kvPairs = [], conditions = []) {
    let kv = new Array(kvPairs.length)
    let condKeys = new Array(conditions.length)
    let values = []

    // for query string
    kv.fill('?? = ?')
    condKeys.fill('?? = ?')

    let kvString = kv.join(',')
    let condString = ''

    if (condKeys.length) {
      condString = 'WHERE ' + condKeys.join(' AND ')
    }

    // attach to end of the values array
    values = values.concat(_.flatten(kvPairs))
    values = values.concat(_.flatten(conditions))

    this.query(`update ${table} set ${kvString} ${condString}`, values)
  },

  /**
   * Return Increment Money
   *
   * @param table
   * @param kvPairs
   * @param conditions
   * @returns {Promise.<void>}
   */
  async increment (table, kvPairs = [], conditions = []) {
    this.arithmetic(table, kvPairs, '+', conditions)
  },

  /**
   * Return Decrement Money
   *
   * @param table
   * @param kvPairs
   * @param conditions
   * @returns {Promise.<void>}
   */
  async decrement (table, kvPairs = [], conditions = []) {
    this.arithmetic(table, kvPairs, '-', conditions)
  },

  /**
   * Return Update Money
   *
   * @param table
   * @param kvPairs
   * @param type
   * @param conditions
   * @returns {Promise.<void>}
   */
  async arithmetic (table, kvPairs = [], type, conditions = []) {
    let kv = new Array(kvPairs.length)
    let condKeys = new Array(conditions.length)
    let values = []

    // for query string
    kv.fill(`?? = ?? ${type} ?`)
    condKeys.fill('?? = ?')

    let kvString = kv.join(',')
    let condString = ''

    if (condKeys.length) {
      condString = 'WHERE ' + condKeys.join(' AND ')
    }

    // attach to end of the values array
    values = values.concat(_.flatten(kvPairs))
    values = values.concat(_.flatten(conditions))

    this.query(`update ${table} set ${kvString} ${condString}`, values)
  },

  /**
   * Do normal select query
   *
   * @param table
   * @param select
   * @param kvPairs
   * @param limit
   * @param orderBy
   * @param joinBy
   * @returns {Promise.<*|Promise>}
   */
  async select (table, select, kvPairs = [], limit = null, orderBy = [], joinBy = []) {
    let lim = ''
    let join = ''
    let where = []
    let order = new Array(orderBy.length)
    let joinVal = _.flatten(joinBy)

    for (let i = 0; i < kvPairs.length; i++) {
      if (kvPairs[i].length > 2) {
        where.push(`?? ${kvPairs[i][1]} ${kvPairs[i][1].toLowerCase() === 'in' ? '(?)' : '?'}`)
        kvPairs[i] = _.remove(kvPairs[i], function (n) {
          return n !== kvPairs[i][1]
        })
      } else {
        where.push('?? = ?')
      }
    }

    let values = _.flatten(kvPairs)

    if (select instanceof Array) {
      select = select.join(',')
    }

    if (kvPairs.length) {
      where = `where ${where.join(' AND ')}`
    }

    if (limit) {
      values.push(limit)
      lim = 'limit ?'
    }

    if (orderBy.length) {
      order = `order by ${orderBy.join(' ')}`
    }

    if (joinBy.length && typeof joinBy[0] === 'string') {
      let type = joinVal[4] ? `${joinVal[4]} join` : `join`
      join = `${type} ${joinVal[0]} on ${joinVal[1]} ${joinVal[2]} ${joinVal[3]}`
    } else if (joinBy.length && joinBy[0] instanceof Array) {
      for (let i = 0; i < joinBy.length; i++) {
        join += `${joinBy[i][4] || 'join'} ${joinBy[i][0]} on ${joinBy[i][1]} ${joinBy[i][2]} ${joinBy[i][3]} `
      }
    }

    return this.query(`select ${select} from ${table} ${join} ${where} ${order} ${lim}`, values)
  },

  /**
   * @param table
   * @param conditions
   * @returns {Promise<void>}
   */
  async delete (table, conditions) {
    let condKeys = new Array(conditions.length)
    let condString = ''

    condKeys.fill('?? = ?')

    if (condKeys.length) {
      condString = 'WHERE ' + condKeys.join(' AND ')
    }

    return this.query(`delete from ${table} ${condString}`, _.flatten(conditions))
  }
}
