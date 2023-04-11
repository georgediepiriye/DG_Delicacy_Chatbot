const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    sender: { type: String, trim: true },
    chat:{type:mongoose.Schema.Types.ObjectId, ref:"Chat"},
    content:{ type:Number}

},{timestamps:true})

const Message = mongoose.model("message", messageSchema)
module.exports = Message