/**
 * Boostrap services here
 */

module.exports = async () => {
  await require('./http')()
  // require('./tcp').start()
}
