const mongoose = require("mongoose")

//Define a new customer
const customerSignUpSchema = new mongoose.Schema({
    familyName: {type: String, required: true}, 
    firstName: {type: String, required: true},
    email: {type: String, required: true}, 
    password: {type: String, default: false, required: true}
})

const CustomerSignUp = mongoose.model("CustomerSignUp", customerSignUpSchema, "customers") // "customers" references the collection the "customers" collection database

//export for other usage
module.exports = CustomerSignUp