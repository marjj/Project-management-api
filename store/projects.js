const mongoose = require('mongoose');
const store = require('./index')

var Schema = mongoose.Schema

var projectSchema = new Schema({
  name: String,
  deadline: String, 
  start_date: String,
  created_by: String,
  created_at: String,
  user_group: Array,
  modules: [{ type: Schema.Types.ObjectId, ref: 'module' }]
})

var moduleSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'project' },
  name: String,
  user_group: Array,
  created_by: String,
  created_at: String,
  deleted: Boolean,
  task: [{ type: Schema.Types.ObjectId, ref: 'task' }]
})


var taskSchema = new Schema({
  module: { type: Schema.Types.ObjectId, ref: 'modules' },
  title: String,
  description: String,
  deadline: String,
  start_date: String,
  finishdate: String,
  done: false, 
  created_at: String,
  created_by: String,
  done_by: String
})


var project = mongoose.model('project', projectSchema);
var modules = mongoose.model('modules', moduleSchema);
var task = mongoose.model('task', taskSchema);

module.exports = { project, modules, task}
