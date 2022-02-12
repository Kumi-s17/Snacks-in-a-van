const express = require('express')

// add our router 
const menuItemRouter = express.Router()

// require the author controller
const menuItemController = require('../controllers/menuItemController.js')

/// handle the GET request to get all authors
menuItemRouter.get('/:_id', menuItemController.getAllmenuItems)

//handle GET request for item by name
menuItemRouter.get('/moreDetails/:vendorId/:id', menuItemController.getMoreDetails)

// export the router
module.exports = menuItemRouter