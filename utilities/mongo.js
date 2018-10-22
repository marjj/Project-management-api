const mongoose = require('mongoose');


module.exports = {
  client: null,

  connect () {
    mongoose.connect('mongodb://localhost:27017/db_test', { useNewUrlParser: true });
    
    var db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () { console.log("success connection") });
   
  }
}
