const { default: mongoose } = require("mongoose")
const mopngoose = require("mongoose")

const chatSchema = mopngoose.Schema(
  {
    
    user: { type: String, trim: true },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema)
module.exports= Chat