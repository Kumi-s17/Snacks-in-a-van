// 4. DEFINE STRATEGIES
require('dotenv').config()

const LocalStrategy = require('passport-local').Strategy; // defining a local strategy (username and password)
const { Customer } = require('../models/customer'); // our customer model
const { Status } = require('../models/status');     // our vendor model
var passwordValidator = require('password-validator');

// Create a schema for the password
var passwordSchema = new passwordValidator();

// Customer password requirements as specified by D4 requirements
passwordSchema
.is().min(8)                      // Minimum length 8
.has().letters(1)                 // Must have lowercase letters
.has().digits(1)                  // Must have at least 1 numerical digit

module.exports = function(passport) {

    passport.serializeUser(function(user, done) { // user = one user in our database
        done(null, user); // if you need to put info into session, encrypt the user._id and put it into session
    });

    passport.deserializeUser(function(user, done) {
        if (user.type == 'customer') {
            Customer.findById(user._id, function(err, user) {
                done(err, user);
            });
        } else {
            Status.findById(user._id, function(err, user) {
                done(err, user);
            });
        }
    });

    // Customer login strategy
    passport.use('local-login', new LocalStrategy({ // name the strategy and then pass a new LocalStrategy
            usernameField : 'email', 
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, email, password, done) { 
            process.nextTick(function() { // handles asynchronous nature of await
                // Checks if user has an email in the database
                Customer.findOne({ 'email' :  email }, function(err, user) { 
                    if (err)
                        return done(err);
                    if (!user) // No user found
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password)){ // User found but invalid password
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else { // If it passes all checks, log customer into app
                        req.session.email = email; // save customer email to session
                        req.session.customerId = user._id; //save customer ID to session
                        return done(null, user, req.flash('loginMessage', 'Logged Out'));
                    }
                });
            });

        }));

        // Vendor login strategy
        passport.use('local-vendorLogin', new LocalStrategy({ // name the strategy and then pass a new LocalStrategy
            usernameField : 'vendorName', 
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, vendorName, password, done) { 
            process.nextTick(function() {
                Status.findOne({ 'vendorName' :  vendorName }, function(err, user) { 
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No vendor found.'));
                    }
                    if (!user.validPassword(password)){
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else {
                        req.session.vendorName = vendorName; // Save vendor name to session
                        req.session.vendorId = user._id; // Save vendor ID to session
                        req.session.userType = "vendor" // Vendor has vendor type                        
                        return done(null, user, req.flash('loginMessage', 'Logged Out'));
                    }
                });
            });

        }));

    // Customer sign up strategy
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true },  
         function(req, email, password, done) {             
            process.nextTick( function() {
                // Don't want to sign up when there is an existing user with the same details
                Customer.findOne({'email': email}, function(err, existingUser) { 
                    if (err) {
                        return done(err);
                    }
                    if (existingUser) {
                        return done(null, false, req.flash('signUpMessage', 'That email is already taken.'));
                    }
                    if (!passwordSchema.validate(password)) {
                        return done(null, false, req.flash('signUpMessage', 'Please enter a valid password that fits the requirements.'));
                    }
                    else {
                        // Otherwise create a new user
                        var newUser = new Customer(); // using User schema, add an instance of a new user
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.familyName = req.body.familyName;
                        newUser.firstName = req.body.firstName;
                        newUser.type = "customer";

                        // and save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                        // Session remembers email, ID and user type
                        req.session.email=email;
                        req.session.customerId = newUser._id;
                        req.session.userType = newUser.type
                    }
                });
            });
        }));
    
    // Customer update password strategy
    passport.use('local-updatePassword', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true }, // pass the req as the first arg to the callback for verification 
     function(req, email, password, done) {             
        process.nextTick( function() {
            Customer.findOne({'email': email}, function(err, existingUser) { // don't want to sign up when there is an existing user with the same details
                if (err) {
                    return done(err);
                }
                else if (!existingUser) // Checks if the user does exist
                    return done(null, false, req.flash('profileMessage', 'No existing user.'));

                else {
                    // If the password doesn't match the current password, we hash and update the new password
                    var newPassword = password
                    if (!passwordSchema.validate(newPassword)) {
                        return done(null, false, req.flash('profileMessage', 'Please enter a valid password that fits the requirements.'));
                    }
                    existingUser.password = existingUser.generateHash(newPassword);
                    existingUser.save(function(err) { // Saves the new updates to the user in database
                        if (err) {
                            throw err;
                        }
                        return done(null, existingUser, req.flash('profileMessage', 'Password successfully updated.'));
                    })
                }
            });
        });
    }));
};


