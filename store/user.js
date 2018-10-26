const mongoose = require('mongoose');
const store = require('./index')

var Schema = mongoose.Schema

var user = new Schema({
  name: String,
  user_name: String,
  authority: Number,
  type: String, 
  login: Boolean,
  password: String,
  avatar: { type: String, default: '' },
  deleted: { type: Boolean, default: false },
  created_at: {type: Date, default: Date.now }
})

var user = mongoose.model('user', user)

module.exports = { user }
