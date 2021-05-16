const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true 
    },
    password:{
        type: String,
        required: true
    },
    // avatar:{
    //     type: String
    // },
  },{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = User = mongoose.model('users', UserSchema);