const express = require('express')
const utilities = require('./utility')

// we will use the passport strategies we defined in 
// passport.js file in config folder to signup and login 
// a user.
const passport = require('passport');
require('../config/passport')(passport);

// require the status controller
const profileController = require('../controllers/profileController.js')

// add our router 
const userRouter = express.Router()

// GET login form
// http:localhost:3000/customer/user-management/login
userRouter.get('/login', (req, res) => {
    res.render('customerLogin', {"loginMessage": String(req.flash("loginMessage"))});
})

// POST login form -- authenticate user
// http:localhost:3000/customer/user-management/login
userRouter.post('/login', passport.authenticate('local-login', { // use local-login strategy - we aren't using a controller anymore
    successReturnToOrRedirect : '/customer', // redirect to the homepage
    failureRedirect : '/customer/user-management/login', // redirect back to the login page if there is an error
    successFlash: true,
    failureFlash : true // allow flash messages
}));

// GET - show the signup form to the user
// http:localhost:3000/customer/user-management/signup
userRouter.get("/signUp", (req, res) => {
    res.render('customerSignUp', {"signUpMessage": String(req.flash("signUpMessage"))});
});

// POST - user submits the signup form -- signup a new user
// http:localhost:3000/customer/user-management/signup
userRouter.post('/signUp', passport.authenticate('local-signup', {
    successRedirect : '/customer', // redirect to the homepage
    failureRedirect : '/customer/user-management/signUp/', // redirect to signup page
    successFlash: true,
    failureFlash : true // allow flash messages
}));

// LOGOUT
// http:localhost:3000/customer/user-management/logout
userRouter.get('/logout', utilities.isLoggedIn, function(req, res) {
    req.logout();
    req.flash('Logged Out');
    res.redirect('/customer/user-management/login');
});

// GET profile page 
// http:localhost:3000/customer/user-management/profile
userRouter.get('/profile', utilities.isLoggedIn, (req, res) => profileController.getProfile(req, res))

// POST - user updates their profile details
// http:localhost:3000/customer/user-management/profile
userRouter.post('/updatePassword', utilities.isLoggedIn, passport.authenticate('local-updatePassword', {
    successRedirect : '/customer/user-management/profile', 
    failureRedirect : '/customer/user-management/profile', 
    successFlash: true,
    failureFlash : true // allow flash messages
}));

userRouter.post('/updateName', utilities.isLoggedIn, (req, res) => profileController.updateName(req, res))


// export the router
module.exports = userRouter
