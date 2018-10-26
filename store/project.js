const mongoose = require('mongoose');
const store = require('./index')

var Schema = mongoose.Schema

var projectSchema = new Schema({
  name: String,
  deadline: String, 
  start_date: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  user_group: Array,
  deleted: { type: Boolean, default: false},
  modules: [{ type: Schema.Types.ObjectId, ref: 'modules' }],
  created_at: {type: Date, default: Date.now }
})

var moduleSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'project' },
  name: String,
  user_group: Array,
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  deleted: { type: Boolean, default: false},
  task: [{ type: Schema.Types.ObjectId, ref: 'task' }],
  created_at: {type: Date, default: Date.now }
})


var taskSchema = new Schema({
  module: { type: Schema.Types.ObjectId, ref: 'modules' },
  title: String,
  description: String,
  deadline: String,
  start_date: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  finishdate: { type: String, default: ''},
  done: { type: Boolean, default: false},
  deleted: { type: Boolean, default: false},
  done_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_at: {type: Date, default: Date.now }
})


var project = mongoose.model('project', projectSchema);
var modules = mongoose.model('modules', moduleSchema);
var task = mongoose.model('task', taskSchema);

module.exports = { project, modules, task}
