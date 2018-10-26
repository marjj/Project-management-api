const mongoose = require('mongoose');
const store = require('./index')

var Schema = mongoose.Schema


var messageSchema = new Schema({
  subject: String,
  content: String,
  file: Object,
  created_by: {type: Schema.Types.ObjectId, ref: 'user'},
  threads: [ { type: Schema.Types.ObjectId, ref: 'thread' } ],
  deleted: { type: Boolean, default: false },
  created_at: {type: Date, default: Date.now }
})

var threadSchema = new Schema({
  content: String,
  message: {type: Schema.Types.ObjectId, ref: 'message'},
  created_by: {type: Schema.Types.ObjectId, ref: 'user'},
  sub_threads: [ { type: Schema.Types.ObjectId, ref: 'sub_thread' } ],
  deleted: { type: Boolean, default: false },
  created_at: {type: Date, default: Date.now }
})

var sub_threadSchema = new Schema({
  content: String,
  created_by: {type: Schema.Types.ObjectId, ref: 'user'},
  thread: { type: Schema.Types.ObjectId, ref: 'thread' },
  deleted: { type: Boolean, default: false },
  created_at: {type: Date, default: Date.now }
})

var message = mongoose.model('message', messageSchema)
var thread = mongoose.model('thread', threadSchema)
var sub_thread = mongoose.model('sub_thread', sub_threadSchema)

module.exports = { message, thread, sub_thread }