const router = require("express").Router()
const {sendMessage, getAllMessages} = require("../controllers/messageController")


//send message
router.post("/", sendMessage)

//get all messages
router.get("/:chat",getAllMessages)



module.exports = router