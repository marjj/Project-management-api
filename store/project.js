const mongoose = require('mongoose');
const store = require('./index')

var Schema = mongoose.Schema

var projectSchema = new Schema({
  name: String,
  deadline: String, 
  start_date: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: String,
  user_group: Array,
  deleted: { type: Boolean, default: false},
  modules: [{ type: Schema.Types.ObjectId, ref: 'modules' }]
})

var moduleSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'project' },
  name: String,
  user_group: Array,
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: String,
  deleted: { type: Boolean, default: false},
  task: [{ type: Schema.Types.ObjectId, ref: 'task' }]
})


var taskSchema = new Schema({
  module: { type: Schema.Types.ObjectId, ref: 'modules' },
  title: String,
  description: String,
  deadline: String,
  start_date: String,
  created_at: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  finishdate: { type: String, default: ''},
  done: { type: Boolean, default: false},
  deleted: { type: Boolean, default: false},
  done_by: { type: Schema.Types.ObjectId, ref: 'user' }
})


var project = mongoose.model('project', projectSchema);
var modules = mongoose.model('modules', moduleSchema);
var task = mongoose.model('task', taskSchema);

module.exports = { project, modules, task}
