const express = require('express')
const utilities = require('./utility')

// add our router 
const customerRouter = express.Router()

// require the status controller
const statusController = require('../controllers/statusController.js')

//GET home page
customerRouter.get('/', statusController.getAllVendors);

// MENU ROUTER //
// set up menu router
const menuItemRouter = require('./menuItemRouter.js')

//menu routes added onto end of '/menu'
customerRouter.use('/menu', menuItemRouter)

// USER-MANAGEMENT ROUTER //
// set up user router
const userRouter = require('./userRouter.js')

//user routes added onto end of '/user-management'
customerRouter.use('/user-management', userRouter)

// set up child router for order route
const customerOrderRouter = require('./orderRouter.js')

// parent router now has access to child router
customerRouter.use('/order', customerOrderRouter)

// route for whenever a customer encounters an error
customerRouter.get('/error', function(req, res) {
    res.render("errorPage")
});

// export the router
module.exports = customerRouter