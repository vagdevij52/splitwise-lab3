const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const GroupSchema = new Schema({
    members:[{
        member:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        isProcessed: String,
        isAccepted: String
    }],
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    groupName:{
        type: String,
        required: true,
        unique: true
    },
    groupAvatar:{
        type: String
    },
  },{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = Group = mongoose.model('group', GroupSchema);