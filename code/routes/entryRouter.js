const express = require('express')

// add our router 
const entryRouter = express.Router()

// CUSTOMER ROUTER //
// set up menu router
const customerRouter = require('./customerRouter.js')

//menu routes added onto end of '/menu'
entryRouter.use('/customer', customerRouter)

// VENDOR ROUTER //
// set up menu router
const vendorRouter = require('./vendorRouter.js')

//menu routes added onto end of '/menu'
entryRouter.use('/vendor', vendorRouter)

entryRouter.get('/', (req, res) => {res.render('entryPage')}) // GET entry page 


// export the router
module.exports = entryRouter