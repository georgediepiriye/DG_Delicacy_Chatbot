const { createError } = require("../error");
const Message = require("../models/messageModel");

//send message
const sendMessage = async (req, res, next) => {
    const { sender, content, chat } = req.body;


  try {
    if (!sender || !content || !chat)return next(createError(400, "Enter all fields"));

    const newMessage = new Message({
      sender,
      content,
      chat,
    });
    return res.status(200).json("Sent");
  } catch (error) {
    next(error);
  }
};

//get all messages
const getAllMessages = async (req, res, next) => {
    const chat = req.params.chat

    try {

        if(!chat) return next(createError(400, "Enter chat id"));
        const messages = await Message.find({ chat: chat })
        if (messages.length === 0) return next(createError(400, "No messages yet"))
        return res.status(200).json(messages)  
    } catch (error) {
        next(error)
    }
}

module.exports = { sendMessage,getAllMessages };
