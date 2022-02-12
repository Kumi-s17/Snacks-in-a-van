const mongoose = require("mongoose")
require("./menuItem")
require("./status")
require("./customer")

//link to vendor model
const Vendor = mongoose.model("Status")
//link to menu model
const MenuItem = mongoose.model("MenuItem")

//link to menu model
const Customer = mongoose.model("Customer")


// define Item Quantity schema
const itemQuantitySchema = new mongoose.Schema({
    qty: {type: Number, default: 1, min: 0, required: true}, 
    menuItemId: {type: mongoose.Types.ObjectId, ref: MenuItem, required: true}
}, { _id: false }
);

const orderSchema = new mongoose.Schema({
    customerId: {type: mongoose.Types.ObjectId, ref: Customer, required: true}, 
    vendorId: {type: mongoose.Types.ObjectId, ref: Vendor, required: true},
    itemList: {type: [itemQuantitySchema], required: true},
    orderNumber: {type: Number},
    orderPlaced: {type: Boolean, default: false, required: true},
    orderPlacedTime: {type: Date},
    orderModified: {type: Boolean, default: false, required: true},
    orderModifiedTime: {type: Date},
    orderReady: {type: Boolean, default: false, required: true},
    orderFulfilled: {type: Boolean, default: false, required: true},
    orderFulfilledTime: {type: Date},
    orderCancelled: {type: Boolean, default: false, required: true},
    orderCancelledTime: {type: Date},
    late: {type: Boolean, default: false, required: true},
    rating: {type: Number, min:1, max: 5},
    comment: {type: String}
})

const Order = mongoose.model("Order", orderSchema, "orders")
const ItemQuantity = mongoose.model("ItemQuantity", itemQuantitySchema)

//export for other usage
module.exports = {Order, ItemQuantity}