const express = require('express');
const ObjectId = require('mongodb').ObjectId; 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var mongoose = require('mongoose');

require('dotenv').config();

const keys= require('../../config/keys');
//Load user model
const User = require('../../models/User');
//Load Profile model
const Profile = require('../../models/Profile');
//Load Group model
const Group = require('../../models/Group');
//Load BillTransaction model
const BillTransactions = require('../../models/BillTransactions');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   POST api/addbilldetails
// @desc    Add Bill Details
// @access  Private
router.post('/addbilldetails', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In Add Bill Details - POST- API");
    Group.findOne({groupName: req.body.groupName}).then(group=>{
        if(!group){
            res.status(400).json({group: 'Group does not exist'});
        }else{
            const billtransactionsfields = {};
            const errors={};
            console.log("Request body: "+JSON.stringify(req.body));
            billtransactionsfields.authorId = req.user.id;
            billtransactionsfields.groupName = req.body.groupName;
            billtransactionsfields.expenseDesc = req.body.expenseDesc;
            billtransactionsfields.expenseAmount = req.body.expenseAmount;
            //billtransactionsfields.expenseComment = req.body.expenseComment;
            billtransactionsfields.members = [];
        
            var credit = billtransactionsfields.expenseAmount/group.members.length;
            console.log("Credit value for each member: "+credit);
            group.members.forEach(memberVal=>{
                var user={};
                if(String(req.user.id)===String(memberVal.member)){
                    // do nothing for author
                }else{
                    user.credit = credit;
                    user.member = memberVal.member;
                    billtransactionsfields.members.push(user);
                }
            });
            console.log('billTransactionFields: '+JSON.stringify(billtransactionsfields));
            new BillTransactions(billtransactionsfields).save().then(billtransactions=>
                res.status(200).json(billtransactions));
            }
    }).catch(err=>{
        res.status(400).json(err);
    });
});

// @route   POST api/getGroupBills
// @desc    Get A Group's Bills
// @access  Private
router.post('/getGroupBills', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In getGroupBills- GET- API");
    BillTransactions.find({groupName: req.body.groupName}).sort({
        created_at: -1
    })
    .then(bills=>{
        if(bills){
            res.json(bills)
        }
    });
});

// @route   POST api/getGroupBills
// @desc    Get A Group's Bills
// @access  Private
router.get('/getGroupBillsFromAllGroupsForAUser', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In getGroupBills- GET- API");
    BillTransactions.find({'members.member': req.user.id}).sort({
        created_at: -1
    })
    .then(bills=>{
        if(bills){
            res.json(bills)
        }
    });
});

// @route   POST api/addExpenseComment
// @desc    Add Expense Comment
// @access  Private
router.post('/addExpenseComment', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In Add Expense Comment - POST- API");
    console.log("Grp name: "+req.body.groupName);
    console.log("expesne desc: "+req.body.expenseDesc);
    console.log("expense comment: "+req.body.text);          
    console.log("req.user.id: "+req.user.id);
    console.log("req.user.username: "+req.user.username);                                                                                                                                                                                                                                                                              
   
    var newComment = {};
    newComment.author = req.user.id;
    newComment.text = req.body.text;
    newComment.name = req.user.username;
    console.log("new comment: "+JSON.stringify(newComment));

    BillTransactions.findOneAndUpdate(
        {expenseDesc: req.body.expenseDesc}, 
        {$push: {expenseComment: newComment}},
        {new: true})
        .then(ec =>{
        console.log(ec)
        if(ec){
            console.log("Added Expense Comment");
            res.json(ec);
        }
    }).catch(err=>{
        res.status(400).json(err);
    });
});

// @route   POST api/getExpenseComment
// @desc    Get Expense Comment
// @access  Private
router.post('/getExpenseComment', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In Get Expense Comment - POST- API");
    console.log("expesne desc: "+req.body.expenseDesc);
    //console.log("expense comment: "+req.body.postComment);  //'members.member': req.user.id
    console.log("req.user.id: "+req.user.id);                                            
    BillTransactions.find(
        {expenseDesc: req.body.expenseDesc})
        .then(expensecomment =>{
        console.log(expensecomment)
        if(expensecomment){
            console.log("Get Expense Comment");
            res.status(200).json(expensecomment);
        }
    })
});
// @route   POST api/leaveGroup
// @desc    Leave a Group
// @access  Private
router.post('/leaveGroup', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In Leave a Group - POST- API");
    console.log("Grp name: "+req.body.groupName);
    console.log("req.user.id: "+req.user.id);                                            
    // BillTransactions.find({groupName: req.body.groupName, 'members.member': req.user.id}).then(grp =>{
    //     console.log(grp)
    //     if(grp){
    //         for(var i=0;i<grp.length;i++){
    //             for(var j=0;j<grp[i].length;j++){
    //                 if(grp[i].members[j].member===req.user.id){
                        
    //              } 
    //             }
    //         }
    //         console.log("grp: "+grp);
    //         //if(billsCredit.)
    //         res.json(grp);
    //         //res.json(expensecomment);
    //     }
    // })
    //Group.find({groupName: req.body.groupName, 'members.member': req.user.id}).then((grp)=>{
        //let id = mongoose.Types.ObjectId(grp[0]._id);
        //BillTransactions.find
        //console.log("Grp: "+grp);
        // BillTransactions.find({groupName: req.body.groupName, 'members.member': req.user.id}).then((usr)=>{
        //     console.log("usr: "+usr[0]);
        // })

        BillTransactions.find({groupName: req.body.groupName, 'members.member': req.user.id})
        .then(bills=>{
            if(bills){
                res.json(bills)
            }
        });
        // Group.remove({'members.member': req.user.id,groupName: req.body.groupName}).then((user)=>{
        //     res.json(user);
        // })
        //console.log("id: "+id);
        //console.log("Grp: "+grp);
        //res.json(grp);
    //})
});

router.get('/youowe', passport.authenticate('jwt', { session: false }), (req,res) => {
    console.log("req.user.id: "+req.user.id)
    let id = mongoose.Types.ObjectId(req.user.id);
    BillTransactions.aggregate([
        {
            $match : {
                members: {
                    $elemMatch: {
                        member: id
                    }
                }
            }
        },
        {
            $unwind: '$members'
        },
        {
            $match:{
                "members.member": id
            }
        },
        {
            $group: {
                _id: '$members.member',
                sum: {
                    $sum: '$members.credit'
                }
            }
        }
    ]).then(billtransactions => {
        if(billtransactions){
            console.log("billtransactions "+billtransactions);
            if(billtransactions.length === 0){
               var billtransaction = {}
                billtransaction._id = id;
                billtransaction.sum = 0;
                billtransactions.push(billtransaction);
            }
            res.status(200).json(billtransactions);
        }else {
            billtransaction = {}
            billtransaction._id = id;
            billtransaction.sum = 0;
            billtransactions.push(billtransaction);
            res.status(200).json(billtransactions);
        }   
        
    })
    //select sum(credit) as credit from userTransaction  where authorEmail =? AND userEmail!=? group By authorEmail IS NOT NULL
});

router.get('/youAreOwed', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In YOU ARE OWED - POST- API");
    //console.log("Grp name: "+req.body.groupName);
    console.log("req.user.id: "+req.user.id);                                            
    let id = mongoose.Types.ObjectId(req.user.id);
    BillTransactions.aggregate([
    {$match: {authorId:  id}},
    {$unwind: '$members'},
    {$group:{
        _id: '$authorId',
        sum: {$sum: '$members.credit'}
    }}
]).then(billtransactions=>{
    console.log(billtransactions);
    res.status(200).json(billtransactions);
})
});



// @route   POST api/youOweSummary
// @desc    Get Expense Comment
// @access  Private
router.get('/youOweSummary', passport.authenticate('jwt', { session: false }), async(req,res) => {
    console.log("req.user.id: "+req.user.id)
    let id = mongoose.Types.ObjectId(req.user.id);
    var billTxns = await BillTransactions.aggregate([
        {
            $match : {
                members: {
                    $elemMatch: {
                        member: id
                    }
                }
            }
        },
        {
            $unwind: '$members'
        },
        {
            $match:{
                "members.member": id
            }
        },
        {
            $group: {
                _id: '$authorId',
                sum: {
                    $sum: '$members.credit',
                }
            }
        }
    ]);
    console.log("billTxn "+ JSON.stringify(billTxns));
    var billtransactions = [];
    for(var i=0; i< billTxns.length; i++){
        var billtransaction = {};
        var user = await User.findById(billTxns[i]._id);
        console.log("user "+user);
        billtransaction.name = user.username;
        billtransaction.sum = billTxns[i].sum;
        billtransactions.push(billtransaction);

    }
    res.json(billtransactions);
    //select sum(credit) as credit from userTransaction  where authorEmail =? AND userEmail!=? group By authorEmail IS NOT NULL
});

router.get('/youAreOwedSummary',  passport.authenticate('jwt', { session: false }), async(req,res) => {
    console.log("req.user.id: "+req.user.id)
    let id = mongoose.Types.ObjectId(req.user.id);
    var billTxns = await BillTransactions.aggregate([
        {$match : {authorId: id}},
        {$unwind: '$members'},
        {$group: {
            _id: '$members.member',
            sume: {
                $sum: '$members.credit'
            }
        }
        }
    ]);
    console.log("billTxn "+ JSON.stringify(billTxns));
    var billtransactions = [];
    for(var i=0; i< billTxns.length; i++){
        var billtransaction = {};
        var user = await User.findById(billTxns[i]._id);
        console.log("user "+user);
        billtransaction.name = user.username;
        billtransaction.sum = billTxns[i].sume;
        billtransactions.push(billtransaction);

    }
    console.log("billtrasnactions1: "+JSON.stringify(billtransactions));
    res.json(billtransactions);
    //select sum(credit) as credit from userTransaction  where authorEmail =? AND userEmail!=? group By authorEmail IS NOT NULL
});


// Settle up
router.post('/settleup', passport.authenticate('jwt', { session: false }), async(req,res)=>{
    const billtransactionsfields = {};
    console.log("Backend -- In SETTLE UP - POST- API");
    console.log("req.body.authorId: "+req.body.authorId);
    console.log("You are settling up with this user: "+req.user.id);                                            
    //let id = mongoose.Types.ObjectId(req.user.id);
    var user = await User.find({username:req.body.authorId});
    console.log("Usr id: "+user[0]._id);
    var youAreOwed = 0;
    var youOwed = 0;
    //----You are owed
    let id = mongoose.Types.ObjectId(user[0]._id);
    var billTxns = await BillTransactions.aggregate([
        {$match : {authorId: id}},
        {$unwind: '$members'},
        {$group: {
            _id: '$members.member',
            sume: {
                $sum: '$members.credit'
            }
        }
        }
    ]);
    console.log("billTxns "+billTxns);
    for(var i=0; i< billTxns.length; i++){
        console.log("String(billTxns[i]._id) === String(req.user.id) "+String(billTxns[i]._id) === String(req.user.id));
        if(String(billTxns[i]._id) === String(req.user.id)){
            youAreOwed = billTxns[i].sume;
        }
    }
    console.log("youAreOwed "+youAreOwed);
    /////-------you owe

    var billTxnsYouOwe = await BillTransactions.aggregate([
        {
            $match : {
                members: {
                    $elemMatch: {
                        member: id
                    }
                }
            }
        },
        {
            $unwind: '$members'
        },
        {
            $match:{
                "members.member": id
            }
        },
        {
            $group: {
                _id: '$authorId',
                sum: {
                    $sum: '$members.credit',
                }
            }
        }
    ]);
    console.log("billTxnsYouOwe "+billTxnsYouOwe);
    for(var i=0; i< billTxnsYouOwe.length; i++){
        console.log("String(billTxnsYouOwe[i]._id) === String(req.user.id) "+String(billTxnsYouOwe[i]._id) === String(req.user.id));
        if(String(billTxnsYouOwe[i]._id) === String(req.user.id)){
            youOwed = billTxnsYouOwe[i].sum;
        }
    }

    console.log("youOwed "+youOwed);


    if(youOwed - youAreOwed < 0){
        billtransactionsfields.authorId = req.user.id;
            billtransactionsfields.expenseDesc = 'SettleUp'+'_'+new Date().toString();
            billtransactionsfields.expenseAmount = youAreOwed - youOwed;
            //billtransactionsfields.expenseComment = req.body.expenseComment;
            billtransactionsfields.members = [];
            var usr = {};
            usr.credit = youAreOwed - youOwed;
            usr.member = id;
            billtransactionsfields.members.push(usr);

    }else{
        billtransactionsfields.authorId = id;
            billtransactionsfields.expenseDesc = 'SettleUp'+'_'+new Date().toString();
            billtransactionsfields.expenseAmount = youOwed - youAreOwed;
            //billtransactionsfields.expenseComment = req.body.expenseComment;
            billtransactionsfields.members = [];
            var usr = {};
            usr.credit = youOwed - youAreOwed;
            usr.member = req.user.id;
            billtransactionsfields.members.push(usr);
    }

    console.log("BilltrsanactionFields "+ JSON.stringify(billtransactionsfields));
    var billTransactions = await new BillTransactions(billtransactionsfields).save();
    res.json(billTransactions);
    
});

router.post('/settleup', passport.authenticate('jwt', { session: false }), async(req,res)=>{
    const billtransactionsfields = {};
    console.log("Backend -- In SETTLE UP - POST- API");
    console.log("req.body.authorId: "+req.body.authorId);
    console.log("You are settling up with this user: "+req.user.id);                                            
    //let id = mongoose.Types.ObjectId(req.user.id);
    var user = await User.find({username:req.body.authorId});
    console.log("Usr id: "+user[0]._id);
    var youAreOwed = 0;
    var youOwed = 0;
    //----You are owed
    let id = mongoose.Types.ObjectId(user[0]._id);
    var billTxns = await BillTransactions.aggregate([
        {$match : {authorId: id}},
        {$unwind: '$members'},
        {$group: {
            _id: '$members.member',
            sume: {
                $sum: '$members.credit'
            }
        }
        }
    ]);
    console.log("billTxns "+billTxns);
    for(var i=0; i< billTxns.length; i++){
        console.log("String(billTxns[i]._id) === String(req.user.id) "+String(billTxns[i]._id) === String(req.user.id));
        if(String(billTxns[i]._id) === String(req.user.id)){
            youAreOwed = billTxns[i].sume;
        }
    }
    console.log("youAreOwed "+youAreOwed);
    /////-------you owe

    var billTxnsYouOwe = await BillTransactions.aggregate([
        {
            $match : {
                members: {
                    $elemMatch: {
                        member: id
                    }
                }
            }
        },
        {
            $unwind: '$members'
        },
        {
            $match:{
                "members.member": id
            }
        },
        {
            $group: {
                _id: '$authorId',
                sum: {
                    $sum: '$members.credit',
                }
            }
        }
    ]);
    console.log("billTxnsYouOwe "+billTxnsYouOwe);
    for(var i=0; i< billTxnsYouOwe.length; i++){
        console.log("String(billTxnsYouOwe[i]._id) === String(req.user.id) "+String(billTxnsYouOwe[i]._id) === String(req.user.id));
        if(String(billTxnsYouOwe[i]._id) === String(req.user.id)){
            youOwed = billTxnsYouOwe[i].sum;
        }
    }

    console.log("youOwed "+youOwed);


    if(youOwed - youAreOwed < 0){
        billtransactionsfields.authorId = req.user.id;
            billtransactionsfields.expenseDesc = 'SettleUp'+'_'+new Date().toString();
            billtransactionsfields.expenseAmount = youAreOwed - youOwed;
            //billtransactionsfields.expenseComment = req.body.expenseComment;
            billtransactionsfields.members = [];
            var usr = {};
            usr.credit = youAreOwed - youOwed;
            usr.member = id;
            billtransactionsfields.members.push(usr);

    }else{
        billtransactionsfields.authorId = id;
            billtransactionsfields.expenseDesc = 'SettleUp'+'_'+new Date().toString();
            billtransactionsfields.expenseAmount = youOwed - youAreOwed;
            //billtransactionsfields.expenseComment = req.body.expenseComment;
            billtransactionsfields.members = [];
            var usr = {};
            usr.credit = youOwed - youAreOwed;
            usr.member = req.user.id;
            billtransactionsfields.members.push(usr);
    }

    console.log("BilltrsanactionFields "+ JSON.stringify(billtransactionsfields));
    var billTransactions = await new BillTransactions(billtransactionsfields).save();
    res.json(billTransactions);
    
});


router.get('/owesummary', passport.authenticate('jwt', { session: false }), async(req,res) => {
    console.log("Backend -- In owesummary - POST- API");
    console.log("You are settling up with this user: "+req.user.id);                                            
   
    //----You are owed
    let id = mongoose.Types.ObjectId(req.user.id);
    var billTxns = await BillTransactions.aggregate([
        {$match : {authorId: id}},
        {$unwind: '$members'},
        {$group: {
            _id: '$members.member',
            sume: {
                $sum: '$members.credit'
            }
        }
        }
    ]);
    var billtransactions = [];
    for(var i=0; i< billTxns.length; i++){
        var billtransaction = {};
        var user = await User.findById(billTxns[i]._id);
        console.log("user "+user);
        billtransaction.name = user.username;
        billtransaction.sum = billTxns[i].sume;
        billtransactions.push(billtransaction);

    }
    console.log("billtrasnactions1: "+JSON.stringify(billtransactions));

    var billTxnsYouOwe = await BillTransactions.aggregate([
        {
            $match : {
                members: {
                    $elemMatch: {
                        member: id
                    }
                }
            }
        },
        {
            $unwind: '$members'
        },
        {
            $match:{
                "members.member": id
            }
        },
        {
            $group: {
                _id: '$authorId',
                sum: {
                    $sum: '$members.credit',
                }
            }
        }
    ]);
    console.log("billTxnsYouOwe "+billTxnsYouOwe);
    var billtransactionsYouOwe = [];
    for(var i=0; i< billTxnsYouOwe.length; i++){
        var billtransactionyouowe = {};
        var user = await User.findById(billTxnsYouOwe[i]._id);
        console.log("user "+user);
        billtransactionyouowe.name = user.username;
        billtransactionyouowe.sum = billTxnsYouOwe[i].sum;
        billtransactionsYouOwe.push(billtransactionyouowe);

    }
    console.log("billtransactionsYouOwe "+JSON.stringify(billtransactionsYouOwe));
    var summaryMap = new Map();
    for(var i=0; i< billtransactions.length; i++){
        summaryMap.set(billtransactions[i].name, billtransactions[i].sum);
    }
    for(var j=0;j<billtransactionsYouOwe.length; j++){
        if(summaryMap.has(billtransactionsYouOwe[j].name)){
            summaryMap.set(billtransactionsYouOwe[j].name, summaryMap.get(billtransactionsYouOwe[j].name)-billtransactionsYouOwe[j].sum);
        }else{
            summaryMap.set(billtransactionsYouOwe[j].name, billtransactionsYouOwe[j].sum);
        }
    }
    console.log("summary "+JSON.stringify(summaryMap));
    console.log("summary "+[...summaryMap.keys()]);
    var summary = [];
    for(var k=0; k<[...summaryMap.keys()].length;k++){
        var sum = {};
        sum.name = [...summaryMap.keys()][k];
        sum.summ = summaryMap.get([...summaryMap.keys()][k]);
        summary.push(sum);
    }
    res.json(summary);

})

module.exports = router;