const { createError } = require("../error")
const Chat = require("../models/chatModel")

const accessChat = async (req, res, next) => {
    const username = req.body.username
    if (!username) return next(createError(400, "please enter username"))
    try {
        //find the user chatroom
        const chat = await Chat.findOne({ user: username })
        //create a new chat room if none is found with given username
        if (!chat) {
            const newChat = new Chat({
                user:username
            })
            const savedChat = await newChat.save()
            if (!savedChat) return next(createError(400, "Something went wrong"))
            return res.status(200).json(savedChat)
        }
        return res.status(200).json(chat)
        
    } catch (error) {
        next(error)
    }
}

module.exports = {accessChat}