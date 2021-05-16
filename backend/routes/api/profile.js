const express = require('express');
const ObjectId = require('mongodb').ObjectId; 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys= require('../../config/keys');
//Load user model
const User = require('../../models/User');
//Load Profile model
const Profile = require('../../models/Profile');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', ()=>{

});

// @route   GET api/profile
// @desc    Get current users's profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req,res)=>{
console.log("Req.id: "+req.user.id);
console.log("Req.email: "+req.user.email);
const errors = {};
Profile.findOne({user: req.user.id})
.then(profile => {
    console.log("Profile: "+profile);
    if(!profile){
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
    }
    res.json(profile);
}).catch(err => res.status(404).json(err));
});


// @route   POST api/profile
// @desc    Create users's profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req,res)=>{
    console.log("Backend -- In updateProfile- POST- API");
    console.log("Req.id: "+req.user.id);
    console.log("Req.email: "+req.user.email);
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.username) profileFields.username = req.body.username;
    if(req.body.email) profileFields.email = req.body.email;
    if(req.body.avatar) profileFields.avatar = req.body.avatar;
    if(req.body.phone) profileFields.phone = req.body.phone;
    if(req.body.defaultCurrency) profileFields.defaultCurrency = req.body.defaultCurrency;
    if(req.body.timezone) profileFields.timezone = req.body.timezone;
    if(req.body.language) profileFields.language = req.body.language;

    Profile.findOne({user: req.user.id })
    .then(profile =>{
        if(profile){
            //Update if profile already exists
            console.log("Profile alreday exists..So updating!");
            Profile.findOneAndUpdate(
                { user:req.user.id }, 
                { $set: profileFields },
                { new: true }
            )
            .then(profile => res.json(profile) );
        }
        //Create if profile doesnt exists
        else{
            //check if handle exists
            Profile.findOne({handle: profileFields.handle})
            .then(profile => {
                if(profile){
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }
                //Save Profile
                console.log("Creating a new profile!");
                new Profile(profileFields).save().then(profile => res.json(profile) );
            })
        }
    })
    });
module.exports = router;