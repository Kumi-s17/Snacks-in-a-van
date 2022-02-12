  
const mongoose = require("mongoose")

//Define the schema for a menu item
const menuItemSchema = new mongoose.Schema({
    link: String, 
    photoId: String, 
    itemName: String, 
    isFood: Boolean,
    itemPrice: String,
    id:String,
    desc:String,
    calories:String,
    protein:String,
    carbohydrates: String, 
    fat:String
})


const MenuItem = mongoose.model("MenuItem", menuItemSchema, "menu")
//export for other usage
module.exports = MenuItem