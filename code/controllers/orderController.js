// Control orders related queries in both vendor and customer
const mongoose = require("mongoose")

// Set parameters to allows extra/disallow mongoose functionality
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Link to order model
const Order = mongoose.model("Order")

// Link to vendor model
const Vendor = mongoose.model("Status")

// Link to menu model
const MenuItem = mongoose.model("MenuItem")

// :ink to itemQuantity mode
const ItemQuantity = mongoose.model("ItemQuantity")

// Link to customer model
const Customer = mongoose.model("Customer")

// Time to modify/cancel
const minutesToChange = 10

const minutesToDiscount = 1

const discountAmount = 0.2

//Determines the milliseconds between loops of lateChecker() 
const loopTimer = 1000

//Checks if any orders that are not ready are late 
function lateChecker(){
	// Determine what time in which order placed time would be late
	var lateTime = Date.now() - minutesToDiscount*60000
	// Finds and update orders that have been placed, but are not ready and a certain time has elasped
	Order.updateMany({orderPlaced: true, orderReady: false, late: false, orderPlacedTime: {$lte: lateTime}}, {$set: {late: true}}, {}, (err,doc)=>{
		if(err){
			console.log(err)
		}	
	})
	setTimeout(lateChecker, loopTimer)
}

lateChecker()

// Returns the status of a given bar
function statusChecker(oneOrder){
	if(oneOrder.orderFulfilled){
		return "Fulfilled";
	}
	if(oneOrder.orderReady){
		return "Ready"
	}
	if(oneOrder.late){
		return "Late"
	}
	if(oneOrder.orderPlaced){
		return "Preparing"
	}
	else{
		return "Cart"
	}
}

// Find a qty for a specific item in an cart for us in ajax (GET)
const getOneItemQty = async (req, res) => {  
	try {
		// Find order by objectID in db and convert to JSON fomat
		const oneOrder = await Order.findById(req.params.orderId)
		
		// Creates list of items in order and calcaultes total cost
		var qty = "1000" 
		for(i = 0; i < oneOrder.itemList.length; i++){
			if(oneOrder.itemList[i].menuItemId.equals(req.params.itemId)){
				var qty = String(oneOrder.itemList[i].qty)
				break
			}
		}
		return res.send(qty)

	} catch (err) { // error occurred
		res.status(400)
		return res.send("Database query failed")
	}
}

// Update qty for 1 item for use in AJAX (POST)
const updateOneItemQty = async (req, res) => {  
	//This method is used as it offers the greatest response times
	Order.findOne({"_id": req.params.orderId}, function(err, order){
		if(err){
			console.log(err)
			res.status(400)
			return res.send("Database query failed")
		}
		// Creates default output
		var output = {"qtyChange" : 0, "qty" : null}
		// Finds order and increments or decrements quantity
		for(i = 0; i < order.itemList.length; i++){
			if(order.itemList[i].menuItemId.equals(req.params.itemId)){
				if (!(req.body.increment == "-1" && order.itemList[i].qty == "1")){
					order.itemList[i].qty += Number(req.body.increment)
					order.save()
					output["qtyChange"] = req.body.increment
				}
				res.status(200)
				output["qty"] = order.itemList[i].qty
				return res.send(output)
			}
		}
	})
}

// Removes an item from the cart for use in AJAX (POST)
const removeOneItemFromCart = async (req, res) => {  
	Order.findByIdAndUpdate(req.params.orderId,
		{$pull: {"itemList" : {"menuItemId" : req.params.itemId}}},
		{new: true})
		.then((newOrder) =>{
			res.status(200)
			var output = {"cartEmpty": false}
			if(newOrder.itemList.length === 0){
				output["cartEmpty"] = true
			}
			return res.send(output)
		})
		.catch((err)=>{
			console.log(err)
			return next(err)
		})
}

// Adds one item to Cart for use in AJAX (POST)
const addToCart =  async (req, res) => { 
	// Checks if logged in
	if (!req.isAuthenticated()){
		res.status(401)
		return res.send("Not logged in")
	}
	try {
		// Find item
		const menuItem = await MenuItem.findOne( {_id: req.params.menuItemId} )
		// Add error if menuItem is not found
		
		var vendorId = req.params.vendorId;

		// Find cart 
		const cart = await Order.findOne(
			{vendorId: vendorId, 
				customerId: req.session.customerId, 
				orderPlaced: false},
		)
			
		//Creates cart if no cart is found
		if(!cart){
			const oneOrder = new Order() 

			// Enter attributes into document
			oneOrder.customerId = req.session.customerId
			oneOrder.vendorId = vendorId
		
			oneOrder.orderPlacedTime = null
			oneOrder.orderModifiedTime = null
			oneOrder.orderFulfilledTime = null
			oneOrder.orderCancelledTime = null
			oneOrder.orderNumber = null
			oneOrder.rating = null
			oneOrder.comment = null

			const newItemQuantity = new ItemQuantity()
			newItemQuantity.menuItemId = menuItem._id
			oneOrder.itemList.push(newItemQuantity)

			await oneOrder.validate() // Validates document to be accurate with Schema
			oneOrder.save()  // save new order object to database
		}
		else{
			var itemFound = false
			// Finds item in cart and increments it by 1
			for(i = 0; i < cart.itemList.length; i++){
				if(menuItem._id.equals(cart.itemList[i].menuItemId)){
					cart.itemList[i].qty ++
					itemFound = true
					break
				}
			}
			
			// Adds new item to order if no item of said type found
			if(!itemFound){
				const newItemQuantity = new ItemQuantity()
				newItemQuantity.menuItemId = menuItem._id
				cart.itemList.push(newItemQuantity)
			}

			await cart.validate()
			cart.save()
		}
		res.status(200)
		return res.send("Success")
		
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Failed")
	}
}

// Gets cart for specific vendor (GET)
const getCart = async (req, res) => {
	try{
		var vendorId = req.params.vendorId
		// Gets carts and makes into JSON format
		const order = await Order.findOne(
			{vendorId: vendorId, 
				customerId: req.session.customerId, 
				orderPlaced: false}
		).populate('itemList.menuItemId')
		.populate('vendorId')
		.lean()
		
		// Renders cart if no cart found
		if(!order){
			return res.render("cart")
		}

		// Creates list of items in order and calcaultes total cost
		var total = 0

		for(i = 0; i < order.itemList.length; i++){
			order.itemList[i]["subtotal"] = 
				(order.itemList[i].qty * order.itemList[i].menuItemId.itemPrice).toFixed(2)
			total = total + parseFloat(order.itemList[i]["subtotal"])
		}

		// Ensures total is to 2 decimal places
		total = total.toFixed(2)
		return res.render("cart", {"cart": order.itemList, "orderId": order._id, "total":total, "vendorId":order.vendorId})
	
	} catch (err) { // error occurred
		console.log(err)	
		return res.send("Database query failed")
	}

}

/** Placed Orders functions for customers */

// Update an order to fulfilled status (POST)
const updateOrderPlaced = async (req, res) => {
	try {
		// Ensures order has not been already placed
		// Updates orderPlaced and OrderPlaceTime and resets orderModified and orderModifiedTime to default values
		let order = await Order.findOneAndUpdate({_id: req.params.orderId, orderPlaced: false},
			{orderPlaced : true,
			orderPlacedTime : Date.now(),
			orderModified: false,
			orderModifiedTime: null}, {new: true}
			)  // check that an order with this Id already exists
		if (!order) {    // if order is not already in database, return an error
			console.log("Order cannot be placed")
		}
		else if (!order.orderNumber){
			const vendor = await Vendor.findByIdAndUpdate(order.vendorId, {$inc: {orderNumberCount: 1}})
			order.orderNumber = vendor.orderNumberCount
			order.save()
		}
		

		res.status(200)
		return res.redirect("/customer/order/getOrder/" + req.params.orderId) // return saved order to sender

	} catch (err) {   // error detected
		console.log(err)
		res.status(400)
		return res.send("Database update failed")
	}
}

// Gets all placed orders for a specific customer (GET)
const getAllPlacedOrders = async (req, res) => {
	try {
		// Find orders that have been placed by customer
		const orders = await Order.find({orderPlaced: true, orderCancelled: false, customerId: req.session.customerId}, 
			null, {sort: {orderPlacedTime: -1}}).populate('vendorId').lean()
		
		// Determines their status
		for(i = 0; i < orders.length; i++){
			orders[i].status = statusChecker(orders[i])
		}
		return res.render('ordersplaced', {"orders":orders})
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}

// Find an order by their id (GET)
const getOneOrder = async (req, res) => {  
	try {
		// Find order by objectID in db and convert to JSON fomat
		const oneOrder = await Order.findOne( {"_id": req.params.orderId})
			.populate("vendorId")
			.populate('itemList.menuItemId')
			.lean()
		if (oneOrder === null) { // no such order found in database
			res.status(404)
			return res.render("oneOrder")
		}

		if (!oneOrder.customerId.equals(req.session.customerId)) { // If specific order belong to user in session
			res.status(403) // User is forbidden from seeing other user's orders
			return res.redirect('/customer/user-management/login')
		}
		
		// Creates list of items in order and calcaultes total cost
		var total = 0

		for(i = 0; i < oneOrder.itemList.length; i++){
			oneOrder.itemList[i]["subtotal"] = 
				(oneOrder.itemList[i].qty * oneOrder.itemList[i].menuItemId.itemPrice).toFixed(2)
			total = total + parseFloat(oneOrder.itemList[i]["subtotal"])
		}

		// Apply discount if order is late
		var discountTotal = (total * (1 - discountAmount)).toFixed(2)

		// Ensure total is to 2 decimal places
		total = total.toFixed(2)

		// Create cutoff time to prevent further orders
		var cutoffTime = new Date(oneOrder.orderPlacedTime.getTime() + minutesToChange*60000)

		var cutoff = true
		if(cutoffTime <= Date.now() || oneOrder.ready){
			cutoff = false
		}

		var status = statusChecker(oneOrder)

		// Checks if feedback has been submitted
		var feedbackSubmitted = false
		if (oneOrder.rating !== null) {
			feedbackSubmitted = true
		}
		return res.render("oneOrder", {"order": oneOrder, 
		"itemList": oneOrder.itemList,
		"cutoffTime": cutoffTime,
		"cutoff" : cutoff, 
		"total": total,
		"status": status,
		"discountTotal":discountTotal,
		"feedbackSubmitted": feedbackSubmitted
	})

	} catch (err) { // error occurred
		res.status(400)
		console.log(err)
		return res.send("Database query failed")
	}
}

// Gets status of specific order for use by ajax, returns string of status (GET)
const getStatus = async(req, res) => {
	try {
		const order = await Order.findById(req.params.orderId)
		var orderStatus = statusChecker(order)
		result = {status: orderStatus, late: false}
		if(orderStatus == "Late"){
			result.late = true
		}
		res.status(200)
		return res.send(result)
	}catch(err){
		console.log(err)
		return res.send()
	}
}

// Modify specific order (POST)
const modifyOrder = async (req, res) => {
	try{
		const order = await Order.findById(req.params.orderId)  // check that an order with this Id already exists
		
		if (!order) {    // if order is not already in database, return an error
			res.status(400)
			return res.send("Order not found in database")
		}

		if (!order.customerId.equals(req.session.customerId)) { // If specific order belong to user in session
			res.status(403) // User is forbidden from seeing other user's orders
			return res.redirect('/customer/user-management/login')
		}

		// Checks if coniditon are met to modify order
		if (order.orderPlacedTime.getTime() + minutesToChange*60000 > Date.now() || !order.orderReady){
			// Resets orderPlaced to return to cart state
			order.orderPlaced = false
			order.orderPlacedTime = null

			// Set orderModified
			order.orderModified = true
			order.orderModifiedTime = Date.now()
			await order.validate()
			order.save()
			return res.redirect("/customer/order/cart/" + order.vendorId) 
		}

		res.send("Order cannot be modified")
		
	} catch (err) {
		res.status(400)
		return res.send("Database update failed")
	}
}

// Cancel specific order (POST)
const cancelOrder = async (req, res) => {
	try{
		const order = await Order.findById(req.params.orderId)  // check that an order with this Id already exists
		
		if (!order) {    // if order is not already in database, return an error
			res.status(400)
			return res.send("Order not found in database")
		}

		if (!order.customerId.equals(req.session.customerId)) { // If specific order belong to user in session
			res.status(403) // User is forbidden from seeing other user's orders
			return res.redirect('/customer/user-management/login')
		}

		// Checks if conditions are satisfied to cancel order
		if (order.orderPlacedTime.getTime() + minutesToChange*60000 > Date.now() || !order.orderReady){
			order.orderCancelled = true
			order.orderCancelledTime = Date.now()
			await order.validate()
			order.save()
		}

		return res.redirect("/customer/order/previousOrders") 
		
	} catch (err) {
		res.status(400)
		return res.send("Database update failed")
	}
}

/**Feedback functions */
// Goes to feedback page (GET)
const getFeedback = async (req, res) => {
	try {
		const order = await Order.findById(req.params.orderId).lean() //Find the associated order
		if (!order.customerId.equals(req.session.customerId)) { // If specific order belongs to user in session
			res.status(403) // User is forbidden from seeing other user's orders
			return res.redirect('/customer/user-management/login')
		}
		else {
			return res.render("orderFeedback", {"orderId": req.params.orderId})
		}
	} catch (err) { // error occurred
		res.status(400)
		console.log(err)
		return res.send('customer/error')
	}
}

// Submits feedback to database (POST)
const submitFeedback = async (req, res) => {
	try {
		// Finds order and updates the database with feedback
		await Order.findByIdAndUpdate(req.params.orderId, {
			rating: Number(req.body.rating),
			comment: req.body.comment
		})
		return res.redirect('/customer/order/getOrder/'+ req.params.orderId)
	} catch (err) { // error occurred
		console.log(err)
		res.status(400)
		return res.redirect('/customer/error')
	}
}

/** Order Functions for Vendor */

// Gets all outstanding orders for a specific vendor using their _id (GET)
const getAllOutstandingOrders = async (req, res) => {
	try {
		// Find orders that have not been fulfilled but have been placed for specific vendor
		const orders = await Order.find({vendorId: req.session.vendorId, 
			orderFulfilled: false,
			orderCancelled: false, 
			orderPlaced: true}, null, {sort: {orderPlacedTime: 1}})		
			.populate("customerId")
			.populate('itemList.menuItemId')
			.lean()

		for(i = 0; i < orders.length; i++){
			// Work out time at which discount will be applied
			var cutoffTime = new Date(orders[i].orderPlacedTime.getTime() + minutesToDiscount*60000)

			// Determine cutoff for when order will be late
			var cutoff = true
			if(cutoffTime <= Date.now()){
				cutoff = false
			}
			orders[i].cutoff = cutoff
			orders[i].cutoffTime = cutoffTime

			// Determine subtotal and Price
			var total = 0

			for(j = 0; j < orders[i].itemList.length; j++){
				orders[i].itemList[j].subtotal = 
					(orders[i].itemList[j].qty * orders[i].itemList[j].menuItemId.itemPrice).toFixed(2)
				total = total + parseFloat(orders[i].itemList[j]["subtotal"])
			}

			//Ensure total is to 2 decimal places
			orders[i].total = total.toFixed(2)
			
		}
		return res.render("vendorCurrentOrders", {"orders": orders})
	} catch (err) {
		res.status(400)
		return res.send("Database query failed")
	}
}

//Return updated orders from last interval for use in AJAX (GET)
const getNewOutstandingOrders = async (req, res) => {
	try {
		// Calculates Interval
		const previousTime = new Date(req.params.previousTime - 0)
		const currentTime = new Date(req.params.currentTime - 0)
		// Find orders that have not been fulfilled but have been placed for specific vendor
		const newOrders = await Order.find({vendorId: req.session.vendorId, 
			orderFulfilled: false,
			orderCancelled: false, 
			orderPlaced: true,
			$and: [{orderPlacedTime: {$ne: null}},
			{orderPlacedTime: {$gt: previousTime, $lte: currentTime}}]}, null, {sort: {orderPlacedTime: 1}})		
			.populate("customerId")
			.populate('itemList.menuItemId')
			.lean()
		
		// Calculates variables for new orders
		for(i = 0; i < newOrders.length; i++){
			var cutoffTime = new Date(newOrders[i].orderPlacedTime.getTime() + minutesToDiscount*60000)

			var cutoff = true
			if(cutoffTime <= Date.now()){
				cutoff = false
			}
			newOrders[i].cutoff = cutoff
			newOrders[i].cutoffTime = cutoffTime

			newOrders[i].formattedOrderPlacedTime = formatDateAndTimeInternal(newOrders[i].orderPlacedTime)
		}

		//Get Cancelled Orders or Modified Orders
		const cancelledOrders = await Order.find({vendorId: req.session.vendorId, 
			orderCancelled: true, 
			$and: [{orderCancelledTime: {$ne: null}},
			{orderCancelledTime: {$gt: previousTime, $lte: currentTime}}]})		
			.lean()

		const modifiedOrders = await Order.find({vendorId: req.session.vendorId, 
			orderModified: true, 
			$and: [{orderModifiedTime: {$ne: null}},
			{orderModifiedTime: {$gt: previousTime, $lte: currentTime}}]})		
			.lean()

		res.status(200)

		return res.send({newOrders: newOrders, cancelledOrders: cancelledOrders, modifiedOrders: modifiedOrders, currentTime: currentTime.getTime()})
	} catch (err) {
		res.status(400)
		console.log(err)
		return res.send("Database query failed")
	}
}

// Formats date and time 
function formatDateAndTimeInternal(date) { 
	const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];

	var hour = date.getHours();
	var ampm = "am";
	if(hour > 12){
	  hour = hour - 12;
	  ampm = "pm";
	}

	var minute = date.getMinutes();
	if(minute < 10){
	  minute = "0" + minute
	}
	return  hour + ":" + minute + ampm + " " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
}


// Update order to be ready (POST)
const updateOrderReady = async(req, res) => {
	try {
		let order = await Order.findByIdAndUpdate(req.params.orderId,
			{orderReady : true}
			)  // check that an order with this Id already exists and updates 
		
		if (!order) {    // if order is not already in database, return an error
			res.status(400)
			return res.send("Order not found in database")
		}
		res.status(200)
		return res.send({"completed":true}) 

	} catch (err) {   // error detected
		res.status(400)
		console.log(error)
		return res.send("Database update failed")
	}

}

//Update order to be picked up (POST)
const updateOrderFulfilled = async (req, res) => {
	try {
		let order = await Order.findByIdAndUpdate(req.params.orderId,
			{orderFulfilled : true,
			orderFulfilledTime : Date.now()}
			)  // check that an order with this Id already exists and updates
		
		if (!order) {    // if order is not already in database, return an error
			res.status(400)
			return res.send("Order not found in database")
		}
		res.status(200)
		return res.send({"completed":true}) 

	} catch (err) {   // error detected
		res.status(400)
		console.log(err)
		return res.send("Database update failed")
	}
}

// Gets all outstanding orders for a specific vendor using their _id (POST)
const getAllPastOrders = async (req, res) => {
	try {
		// Find orders all fulfilled orders
		const orders = await Order.find({vendorId: req.session.vendorId, 
			orderFulfilled: true,
			orderCancelled: false, 
			orderPlaced: true}, null, {sort: {orderPlacedTime: -1}})		
			.populate("customerId")
			.populate('itemList.menuItemId')
			.lean()

		return res.render("vendorPastOrders", {"orders": orders})
	} catch (err) {
		res.status(400)
		return res.send("Database query failed")
	}
}





// remember to export the functions
module.exports = {getOneOrder, 
	getOneItemQty,
	getStatus,
	updateOneItemQty,
	removeOneItemFromCart,
	addToCart,
	getCart,
	getAllOutstandingOrders, 
	getNewOutstandingOrders,
	updateOrderPlaced,
	updateOrderReady, 
	updateOrderFulfilled,
	getAllPastOrders,
	getAllPlacedOrders,
	modifyOrder,
	cancelOrder,
	getFeedback,
	submitFeedback}