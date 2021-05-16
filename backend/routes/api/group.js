const express = require('express');
const ObjectId = require('mongodb').ObjectId; 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const keys= require('../../config/keys');
//Load user model
const User = require('../../models/User');
//Load Profile model
const Profile = require('../../models/Profile');
//Load Group model
const Group = require('../../models/Group');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', ()=>{

});
router.get('/test', passport.authenticate('jwt', { session: false }), (req,res) => {
    res.json(req.user);
})
// @route   POST api/createnewgroup
// @desc    Create a New Group
// @access  Private
router.post('/createNewGroup', passport.authenticate('jwt', { session: false }), (req,res)=>{
console.log("Req.gname: "+req.body.groupName);
console.log("group emails: "+JSON.stringify(req.body.emails));
console.log("Admin Id - Req.userid: "+req.user.id);// logged in user who is creating the group- Admin of Group
const errors = {};
Group.findOne({groupName: req.body.groupName})
.then(group => {
    console.log("Group: "+group);
    //Do not allow if same group name already exists.
    if(group){
        //errors.duplicategrouperrmsg = 'A group with same name already exists.Please provide a unique name';
        console.log("Group already exists!!");
        return res.status(400).json("A group with same name already exists.Please provide a unique name");
    }
    //Create New Group if Group Name is unique
        console.log("Creating a new group");
        const groupFields = {};
        groupFields.groupName = req.body.groupName;
        groupFields.adminId = req.user.id;
        groupFields.members = [];
        var users = [];
        groupFields.groupAvatar = req.body.groupAvatar;
        req.body.emails.forEach(email => {
            console.log("email: "+JSON.stringify(email));
            users.push(User.findOne({email:email}))
        });
        Promise.all(users).then((values)=>{
            console.log("Values: "+values);
            values.forEach(value=>{
                if(value!==null){
                    var user = {};
                    if(value.id === req.user.id){
                        user.isProcessed = 'Y';
                        user.isAccepted = 'Y';
                    }else{
                        user.isProcessed = 'N';
                        user.isAccepted = 'N';
                    }
                    user.member = value.id;
                    console.log(user);
                    groupFields.members.push(user);
                    console.log(groupFields);
                }
            });
            console.log('groupfields: '+JSON.stringify(groupFields));
            new Group(groupFields).save().then((group)=> res.json(group));
        }).catch(err=>{
            //res.status(400).json(err);
            res.json(duplicategrouperrmsg);
        });
});
});



// @route   GET api/getMyGroups
// @desc    Get User's joined groups
// @access  Private
router.get('/getMyGroups', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In getMyGroups- GET- API");
    Group.find({"members":{$elemMatch:{member: req.user.id, isProcessed:"Y", isAccepted:"Y"}}},{adminId: 1, groupName:1, 'members.$':1})
    .then(groups=>{
        if(groups){
            res.json(groups)
        }
    });
});

// @route   GET api/getGroupsInvites
// @desc    Get User's  group invites
// @access  Private
router.get('/getGroupInvites', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In getGroupInvites- GET- API");
    Group.find({"members":{$elemMatch:{member: req.user.id, isProcessed:"N", isAccepted:"N"}}},{adminId: 1, groupName:1, 'members.$':1})
    .then(groups=>{
        if(groups){
            res.status(200).json(groups)
        }
    });
});

// @route   POST api/acceptInvite
// @desc    Accept Group Invites
// @access  Private
router.post('/acceptInvite', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In Accept Invite- POST- API");
    Group.findOneAndUpdate({groupName: req.body.groupName, 'members.member': req.user.id}, {$set: {"members.$.isProcessed" : "Y", "members.$.isAccepted" : "Y"}}).then(group =>{
        console.log(group)
        if(group){
            console.log("Invitation accepted");
            res.json(group);
        }
    })
});

// @route   POST api/rejectInvite
// @desc    Reject Group Invites
// @access  Private
router.post('/rejectInvite', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In Reject Invite- POST- API");
    Group.findOneAndUpdate({groupName: req.body.groupName, 'members.member': req.user.id}, {$set: {"members.$.isProcessed" : "Y", "members.$.isAccepted" : "N"}}).then(group =>{
        console.log(group)
        if(group){
            console.log("Invitation rejected");
            res.json("Invitation rejected");
        }
    })
});



// @route   GET api/getRecentActivity
// @desc    Get All Recent Activities across all groups in which req.user.id is a part of
// @access  Private
router.get('/getRecentActivity', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In getRecentActivity - GET- API");
    Group.find({"members":{$elemMatch:{member: req.user.id, isProcessed:"Y", isAccepted:"Y"}}}, {adminId: 1, groupName:1, 'members.$':1})
    .then(groups =>{
        console.log("groups: "+groups);
        var groupNames=[];
        groups.forEach(group=>{
            groupNames.push(group.groupName)
        });
        BillTransactions.find({"groupName":{$in:groupNames}}).sort({
            updated_at: -1
        })
        .then(billtransactions=>{
            if(billtransactions){
                res.json(billtransactions);
            }
        })
    })
});


// @route   GET api/getGroupInfo
// @desc    Get A group info
// @access  Private
router.post('/search', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In search group - GET- API");
    // const findQuery = {
    //     groupName: {
    //           $regex: query,
    //           $options: 'i',
    //         },
    //       };     
    // const query = req.query.query;
    console.log("grpname: "+req.body.groupName);
    console.log("userid: "+req.user.id);
    
    // Group.find({"members":{$elemMatch:{member: req.user.id, isProcessed:"Y", isAccepted:"Y"}}},{groupName:req.body.groupName},{adminId: 1, groupName:1, groupAvatar:1})
    Group.find({groupName: req.body.groupName}, {"members":{$elemMatch:{member: req.user.id, isProcessed:"Y", isAccepted:"Y"}}})
    .then(groups=>{
        if(groups){
            res.status(200).json(groups)
        }
    });
});

// @route   POST api/leaveGroup
// @desc    Leave a Group
// @access  Private
router.post('/leaveGroup', passport.authenticate('jwt', { session: false }), async(req,res)=>{
    console.log("Backend -- In Leave a Group - POST- API");
    console.log("Grp name: "+req.body.groupName);
    console.log("req.user.id: "+req.user.id);                                            
    var group = await Group.findOne({groupName: req.body.groupName,'members.member':req.user.id});
    console.log("User in group: "+group.members[0].member);
    console.log("mem length: "+group.members.length);
    for(var i=0;i<group.members.length;i++){
        //console.log(group.members[i].member + " "+ req.user.id);
        if((group.members[i].member).equals(req.user.id)){
            console.log("user found: "+group.members[i].member);
            console.log("user id is : "+group.members[i]._id);
            var left = await Group.updateOne({'members.member': req.user.id},{ $pull: { members: { _id: group.members[i]._id } } });
            console.log("User left group... "+left);
            // Group.updateOne({'members.member': req.user.id},{ $pull: { members: { _id: group.members[i]._id } } }).then(grp =>{
            //         console.log("removing user from grp: "+grp);
            //         if(grp){
            //             console.log("grp: "+JSON.stringify(grp));
            //             res.status(200).json("user left group");
            //         }
            //     }).catch(err=>{
            //         //res.status(400).json(err);
            //         res.status(500).json("Sorry something went wrong while leaving group");
            //     });
            
        }
    }
});


router.post('/acceptInviteKafka', passport.authenticate('jwt', { session: false }), async(req, res) => {
    console.log("In group.js - /acceptInviteKafka")
    const acceptRes = await callAndWait('acceptInviteKafka', req.body.groupName, req.user.id);
    res.json({acceptRes});
})

module.exports = router;

