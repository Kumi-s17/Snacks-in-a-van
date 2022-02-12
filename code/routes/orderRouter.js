
const express = require('express')
const utilities = require('./utility')

// add router 
const customerOrderRouter = express.Router()

// require the order controller
const orderController = require('../controllers/orderController.js')

// handle GET request to provide feedback for a specific order
customerOrderRouter.get('/feedback/:orderId', utilities.isLoggedIn, orderController.getFeedback)

// handle POST request to submit feedback for a specific order
customerOrderRouter.post('/feedback/:orderId', utilities.isLoggedIn, orderController.submitFeedback)

// handle GET request for a specific order by orderId
customerOrderRouter.get('/getOrder/:orderId', utilities.isLoggedIn, orderController.getOneOrder)

// handle GET requests for retrieving status of single vendor
customerOrderRouter.get('/status/:orderId', orderController.getStatus)

// handle GET request for a qty from a specific order
customerOrderRouter.get('/getOneItemQty/:orderId/:itemId', utilities.isLoggedIn, (req, res) => orderController.getOneItemQty(req, res))

// handle POST request for incrementing qty for a specific order
customerOrderRouter.post('/updateOneItemQty/:orderId/:itemId', utilities.isLoggedIn, (req, res) => orderController.updateOneItemQty(req, res))

// handle POST request for removing item from cart
customerOrderRouter.post('/removeOneItemFromCart/:orderId/:itemId', utilities.isLoggedIn, (req, res) => orderController.removeOneItemFromCart(req, res))

// handle GET request for all placed orders
customerOrderRouter.get('/previousOrders', utilities.isLoggedIn, (req, res) => orderController.getAllPlacedOrders(req, res))

// handle POST requests to add an order
customerOrderRouter.post('/add', (req, res) => orderController.addOrder(req, res))

// handle POST requests to create an order
customerOrderRouter.post('/create', utilities.isLoggedIn, (req, res) => orderController.createOrder(req, res))

// handle POST requests to add to cart
customerOrderRouter.post("/addToCart/:vendorId/:menuItemId", utilities.isLoggedInAddToCart, (req, res) => orderController.addToCart(req, res))

// handle GET requests cart page 
customerOrderRouter.get("/cart/:vendorId", utilities.isLoggedIn, (req, res) => orderController.getCart(req, res))

// handle POST requests to update order to be placed
customerOrderRouter.post('/orderPlaced/:orderId', utilities.isLoggedIn, (req, res) => orderController.updateOrderPlaced(req, res))
 
// handle GET requests to modify order
customerOrderRouter.post('/modifyOrder/:orderId', utilities.isLoggedIn, (req, res) => orderController.modifyOrder(req, res))

// handle POST requests to cancel order to be placed
customerOrderRouter.post('/cancelOrder/:orderId', utilities.isLoggedIn, (req, res) => orderController.cancelOrder(req, res))

// export the router
module.exports = customerOrderRouter