const mongoose = require('mongoose');
const store = require('./index')

var Schema = mongoose.Schema

var user = new Schema({
  name: String,
  user_name: String,
  authority: Number,
  type: String, 
  login: Boolean,
  password: String
})

var messageSchema = new Schema({
  subject: String,
  content: String,
  created_at: String,
  created_by: {type: Schema.Types.ObjectId, ref: 'user'},
  threads: [ { type: Schema.Types.ObjectId, ref: 'thread' } ],
  deleted: { type: Boolean, default: false }
})

var threadSchema = new Schema({
  content: String,
  created_at: String,
  message: {type: Schema.Types.ObjectId, ref: 'message'},
  created_by: {type: Schema.Types.ObjectId, ref: 'user'},
  sub_threads: [ { type: Schema.Types.ObjectId, ref: 'sub_thread' } ],
  deleted: { type: Boolean, default: false }
})

var sub_threadSchema = new Schema({
  content: String,
  created_at: String,
  created_by: {type: Schema.Types.ObjectId, ref: 'user'},
  thread: { type: Schema.Types.ObjectId, ref: 'thread' },
  deleted: { type: Boolean, default: false }
})

var user = mongoose.model('user', user)
var message = mongoose.model('message', messageSchema)
var thread = mongoose.model('thread', threadSchema)
var sub_thread = mongoose.model('sub_thread', sub_threadSchema)

module.exports = {user, message, thread, sub_thread }
