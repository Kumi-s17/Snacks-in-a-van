const mongoose = require("mongoose")
const bcrypt = require('bcrypt-nodejs')


// define the Cart schema
const cartSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem'
       }
})

// define Customer schema
const customerSchema = new mongoose.Schema({
    familyName: {type: String, required: true}, 
    firstName: {type: String, required: true},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    type: {type: String, required: true} // allows session to differentiate between customer and vendor
})


// method for generating a hash; used for password hashing
customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Customer = mongoose.model("Customer", customerSchema, "customers") // "customers" references the collection the "customers" collection database
const Cart = mongoose.model("Cart", cartSchema, "Carts")
module.exports = { Customer, Cart};// make models available to other files

