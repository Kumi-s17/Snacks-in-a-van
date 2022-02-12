const express = require('express')
const utilities = require('./utility')

const passport = require('passport');
require('../config/passport')(passport);

// add our router 
const vendorRouter = express.Router()


vendorRouter.get('/', (req, res) => {res.render('vendorLogin')}) // GET entry page 

// vendorRouter.get('/setLocation/', utilities.isLoggedInVendor, (req, res) => {
//     res.render('vendorMapHome')}) // GET entry page 

vendorRouter.get('/setLocation/', utilities.isLoggedInVendor, (req, res) => statusController.setLocation(req, res)) // GET entry page 


// child router for orders
const vendorOrderRouter = express.Router({mergeParams: true});

// require the order controller
const orderController = require('../controllers/orderController.js')

// login/authenticating features

// GET login form
// http:localhost:3000/vendor/login
vendorRouter.get('/login', (req, res) => {
    res.render('vendorLogin', {"loginMessage": String(req.flash("loginMessage"))});
})

// POST login form -- authenticate user
// http:localhost:3000/vendor/login
vendorRouter.post('/login', passport.authenticate('local-vendorLogin', { // use local-login strategy - we aren't using a controller anymore
    successRedirect : '/vendor/setLocation', // redirect to the homepage
    failureRedirect : '/vendor/login', // redirect back to the login page if there is an error
    successFlash: true,
    failureFlash : true // allow flash messages
}));

// LOGOUT
// http:localhost:3010/vendor/logout
vendorRouter.get('/logout', utilities.isLoggedIn, function(req, res) {
    req.logout();
    req.flash('Logged Out');
    res.redirect('/vendor/login');
});

// parent router now has access to child router
vendorRouter.use('/order', vendorOrderRouter);

// handle GET request for all outstanding orders for a specific vendor
vendorOrderRouter.get('/unfulfilled', utilities.isLoggedInVendor, (req, res) => orderController.getAllOutstandingOrders(req, res))

// handle GET requests for new outstanding order received in the interval
vendorOrderRouter.get('/newUnfulfilled/:currentTime/:previousTime', utilities.isLoggedInVendor, (req, res) => orderController.getNewOutstandingOrders(req, res))

// handle POST requests to update an order to ready status
vendorOrderRouter.post('/ready/:orderId', utilities.isLoggedInVendor, (req, res) => orderController.updateOrderReady(req, res))

// handle POST requests to update an order to picked up
vendorOrderRouter.post('/pickedUp/:orderId', utilities.isLoggedInVendor, (req, res) => orderController.updateOrderFulfilled(req, res))

// handle GET request for all outstanding orders for a specific vendor
vendorOrderRouter.get('/past', utilities.isLoggedInVendor, (req, res) => orderController.getAllPastOrders(req, res))


// child router for status
const vendorStatusRouter = express.Router({mergeParams: true});

//require the status controller
const statusController = require('../controllers/statusController.js')

//parent vendor router now has access to its status router
vendorRouter.use('/status', vendorStatusRouter);

// //handle POST request for sending the location description of the van
vendorStatusRouter.post('/updateLocationDescription', utilities.isLoggedInVendor, (req, res) => statusController.updateLocationDescription(req, res))

//post request to close business: set ReadyForOrders to false
vendorStatusRouter.post('/close', utilities.isLoggedInVendor, (req, res) => statusController.closeBusiness(req, res))

vendorRouter.get('/error', function(req, res) {
    res.render("errorPage")
});


// export the router
module.exports = vendorRouter,vendorStatusRouter, vendorOrderRouter
