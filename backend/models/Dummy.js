const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const DummySchema = new Schema({
    name:{
        type: String,
    },
    subject:{
        type: String,
    },
  });

module.exports = Dummy = mongoose.model('dummy', UserSchema);