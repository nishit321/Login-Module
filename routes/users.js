var express = require('express');
var User = require('../model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

// Register
router.get('/register',(req,res)=>{
    res.render('register');
});

// Login
router.get('/login',(req,res)=>{
    res.render('login');
});

// POST register user
router.post('/register',(req,res)=>{
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
  
    // Validation
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail(); 
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);
    
    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    }else{
        var newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        User.CreateUser(newUser,(err,user)=>{
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg','You are registered and can now login');
        res.redirect('login');
    }
    
});

    passport.use(new LocalStrategy(
	    function (username, password, done) {
                User.getUserByUsername(username, function (err, user) {
                    if (err) throw err;
                    if (!user) {
                        return done(null, false, { message: 'Unknown User' });
                    }

                User.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid password' });
                    }
                });
        });
	}));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
    router.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true}),(req,res)=>{
        res.redirect('/');
    });

module.exports = router;