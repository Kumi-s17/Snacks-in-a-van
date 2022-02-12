
const mongoose = require("mongoose")

//link to menuItem model
const MenuItem = require('../models/menuItem')

const Vendor =  mongoose.model("Status")

// get all menuItems
const getAllmenuItems = async (req, res) => {
		try {
		const vendor = await Vendor.findOne({_id: req.params._id}).lean()
		if (!vendor){
			res.render('menu', { "foundVendor": false})
		}
		const menuItems = await MenuItem.find( {}, {itemName:true, link:true, itemPrice:true, isFood:true, desc:true}).lean()	// we only need names and photos
		if (menuItems === null) {   
			// no menuItem found in database
			res.status(404)
			return res.send("Menu item not found")
		}
	   res.render('menu', { "menuItems": menuItems , "vendor": vendor, "foundVendor": true})
	} catch (err) {
		console.log(err)
		res.render('menu', { "foundVendor": false})
	}
}


// find one by their id
const getMoreDetails = async (req, res) => {  
	try {
		const oneMenuItem = await MenuItem.findOne( {_id: req.params.id},{itemName:true, itemPrice:true, link:true, desc:true, calories:true, fat:true, protein:true, carbohydrates:true} ).lean()
		if (oneMenuItem === null) {   
			// no menuItem found in database
			res.status(404)
			return res.send("menuItem not found")
		}
		res.render("showFood", {thisfood:oneMenuItem, "vendorId": req.params.vendorId})
	} catch (err) {     
		// error occurred
		res.status(400)
		return res.send("Database query failed")
	}
}
    
    
	const getOneMenuItem =  async (req, res) => { // get one food, and render it
	try {
		const menuItem = await MenuItem.findOne( {_id: req.params.id} ).lean()
		// the login status is passed to the showFood template so that 
		// we can enable or disable the Favourites button.
		// req.isAuthenticated() is provided by passport middleware - it returns
		// true if request is authenticated otherwise it returns a false.
		res.render('showMenuItem', {"thisMenuItem": menuItem, "loggedin":req.isAuthenticated()})	
	} catch (err) {
		console.log(err)
	}
}

// remember to export the functions
	module.exports = {getAllmenuItems ,getOneMenuItem, getMoreDetails}
