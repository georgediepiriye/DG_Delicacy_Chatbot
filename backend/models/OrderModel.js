const mongoose = require("mongoose")

const OrderSchema = mongoose.Schema({
    user: { type: String },
    order: [{ type: String }],
    checkedOut: {type: Boolean, default:false},
    status: { type: String, enum: ["pending","cancelled", "delivered"], default: "pending" },
   
},{timestamps:true})

const Order = mongoose.model("Order", OrderSchema)
module.exports = Order