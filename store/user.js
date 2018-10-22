const mongoose = require('mongoose');
const store = require('./index')

var User = new mongoose.Schema({
  name: String,
  user_name: String,
  authority: Number,
  type: String, 
  login: Boolean,
  password: String
})

module.exports = mongoose.model('user', User);
