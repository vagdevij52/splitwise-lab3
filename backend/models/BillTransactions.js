const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const BillTransactionsSchema = new Schema({
    members:[{
        member:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        credit: Number
    }],
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    groupName:{
        type:String,
    },
    expenseDesc:{
        type: String,
         //required: true,
         unique: true
    },
    expenseComment:[{
        author:{
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        text:{
        	type: String,
        	required: true
        },
        name:{
        	type: String,
        },
        date:{
        	type: Date,
        	default: Date.now
        }
    }],
    expenseAmount:{
        type:Number
    }
  },{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = BillTransactions = mongoose.model('billtransactions', BillTransactionsSchema);