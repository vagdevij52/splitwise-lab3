const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys= require('../../config/keys');
//Load user model
const User = require('../../models/User');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');



router.get('/test', (req, res) => res.json({msg: 'Post Works'}));

// @route   POST api/users/signup
// @desc    Tests signup route
// @access  Public
router.post('/signup', (req, res) => {
    console.log("In signup api");
    User.findOne({ email: req.body.email }).then(user => {
        // validation
            if(user){
                //errors.email = 'Email already exists';
                return res.status(400).json('Email already exists');
            }else{
                console.log("Creating a new user");
                const newUser =  new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });
                console.log("newUser: "+JSON.stringify(newUser));
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        console.log("New user: "+newUser);
                        var token = jwt.sign({ id: newUser.id }, keys.secretOrKey, {
                            expiresIn: 86400 // 24 hours
                          });
                        newUser.save(err => {
                            if (err) {
                              res.status(500).send({ message: err });
                              return;
                            }
                  
                            res.json({ userId: newUser._id, username: newUser.username, email: newUser.email, token:'Bearer '+ token });
                          });
                    })
                })
            }
        }).catch(function(err) {
            res.status(400).json(err);
          })
})


router.post('/login', (req, res) => {
    console.log("Backend -- In Login API");
    const email = req.body.email;
    const password = req.body.password;

    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email : email }). then(user => {
        if(!user){
            errors.email = 'user email/password are not correct';
            return res.status(400).json(errors);
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                const payload = {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
                //res.json({ msg: 'Success'})
                jwt.sign(
                    payload, 
                    keys.secretOrKey, 
                    { expiresIn: 3600}, 
                    (err, token) => {
                        res.json({
                            success: true,
                            username: user.username,
                            id: user.id,
                            email: user.email,                            
                            token: 'Bearer '+ token,
                        })
                    });
            }else{
                errors.email = 'user email/password are not correct';
                return res.status(400).json(errors);
            }
        })
    })
});


// @route   GET api/users/current
// @desc    Return Current User
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log("Backend-Get Current User"+JSON.stringify(req.headers));
    res.json(req.user);
});
module.exports = router;