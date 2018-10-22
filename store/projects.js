const mongoose = require('mongoose');
const store = require('./index')

var Projects = new mongoose.Schema({
  name: String,
  deadline: String, 
  start_date: String,
  created_by: String,
  created_at: String,
  user_group: Array,
  modules: Array
})

module.exports = mongoose.model('project', Projects);
