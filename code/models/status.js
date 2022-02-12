const mongoose = require("mongoose")
const bcrypt = require('bcrypt-nodejs')

//define a vendor
const statusSchema = new mongoose.Schema({
    vendorName: {type: String, required: true},
    password: {type: String, required: true},
    readyForOrders: {type: Boolean, required: true},
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    locationDescription: {type: String, required: true},
    orderNumberCount: {type: Number, required:true},
    link: {type: String, required: true},
    type: {type: String, required: true}
})

// method for generating a hash; used for password hashing
statusSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
statusSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Status = mongoose.model("Status", statusSchema, "vendors")

//export for other usage
module.exports = {Status}
