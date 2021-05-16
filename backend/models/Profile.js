const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    username:{
        type: String,
    },
    email:{
        type: String,
        unique: true 
    },
    avatar:{
        type: String
    },
    phone:{
        type: String,
    },
    defaultCurrency:{
        type: String,
    },
    timezone:{
        type: String,
    },
    language:{
        type: String,
    },
  },{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = Profile = mongoose.model('profile', ProfileSchema);