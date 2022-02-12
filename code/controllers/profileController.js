const mongoose = require("mongoose")

const Customer = mongoose.model("Customer")

// Profile page for customers to edit their details
const getProfile = async (req, res) => {  
    try {
		// Looks for customer in database
		const customer = await Customer.find({_id: req.session.customerId})
        if (customer === null) {   
			// no customer profile found in database
			res.status(404)
			return res.send("Customer profile not found.")
		}
        return res.render('customerProfile', {
			"email": customer[0]["email"], 
			"firstName": customer[0]["firstName"],
			"familyName": customer[0]["familyName"],
			"password": customer[0]["password"],
			"profileMessage": String(req.flash("profileMessage"))
		})
	} catch (err) {
		res.status(400)
		return res.redirect('/customer/error')
	}
}

// User updates their first name and / or last name
const updateName = async (req, res) => {  
    try {
		// Find orders that have been placed by customer
		const customer = await Customer.findByIdAndUpdate(req.session.customerId, {
			firstName: req.body.firstName,
			familyName: req.body.familyName
		}, {new: true})
        if (!customer) {   
			// no customer profile found in database
			res.status(404)
			return res.send("Customer profile not found.")
		}
        return res.render('customerProfile', {
			"email": customer.email, 
			"firstName": customer.firstName,
			"familyName": customer.familyName,
			"profileMessage": 'Name successfully updated.'
		})
	} catch (err) {
		res.status(400)
		return res.send("Database query failed")
	}
}

// export the functions
module.exports = {getProfile, updateName} 
