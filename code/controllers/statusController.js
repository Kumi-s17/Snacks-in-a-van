const mongoose = require("mongoose")
// xconst { resolveConfig } = require("prettier")

//Link to Status model
 const Status = mongoose.model("Status")


// get all vendors
const getAllVendors = async (req, res) => {
	try {
		const vendors = await Status.find({readyForOrders:true}, {vendorId:true, vendorName:true, longitude:true, latitude:true, locationDescription:true, link:true}).lean()// we only need names and photos
		if (vendors === null) {   
			// no menuItem found in database
			res.status(404)
			return res.send("vendors not found")
		}
		return res.render("customerMapHome", {"vendors": vendors})
		
	} catch (err) {
		console.log(err)
	}
}


// update the location description of a vendor (POST)
const updateLocationDescription = async (req, res) => {
	try {
	  const locationDescription = await Status.findByIdAndUpdate(req.session.vendorId, {latitude: req.body.latitude, longitude: req.body.longitude, locationDescription: req.body.locationDescription, readyForOrders:true}, {new: true})  
	  if (!locationDescription) {    // if the vendor's status is not in database, return an error
		res.status(400)
		return res.send("vendor not found in database")
	  }
	//res.render('vendorCurrentOrders', {"locationDescription": locationDescription, "loggedin":req.isAuthenticated()})	
	  return res.redirect("/vendor/order/unfulfilled")  // update the location description of the van 
  
	  } catch (err) {   // error detected
		  res.status(400)
		  return res.send("Database update failed")
	  }
}

// update the location description of a vendor (POST)
const closeBusiness = async (req, res) => {
	try {
	  let vendor = await Status.findByIdAndUpdate(req.session.vendorId, { readyForOrders:false}, {new: true}) 
	  if (!vendor) {    // if the vendor's status is not in database, return an error
		res.status(400)
		return res.send("vendor not found in database")
	  }
	//   res.render('vendorCurrentOrders', {"locationDescription": locationDescription, "loggedin":req.isAuthenticated()})	
	  return res.redirect("/vendor/order/past")  // update the location description of the van 
  
	  } catch (err) {   // error detected
		  res.status(400)
		  return res.send("Database update failed")
	  }
}

const setLocation = async (req, res) => {
	try {
	  let vendor = await Status.findById(req.session.vendorId) 
	  if (!vendor) {    // if the vendor's status is not in database, return an error
		res.status(400)
		return res.send("vendor not found in database")
	  }
	  res.render('vendorMapHome', {"readyForOrders": vendor.readyForOrders})
	  } catch (err) {   // error detected
		  res.status(400)
		  return res.send("Database update failed")
	  }
}


module.exports = {getAllVendors,  updateLocationDescription,closeBusiness, setLocation}