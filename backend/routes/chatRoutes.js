const { accessChat } = require("../controllers/chatController")

const router = require("express").Router()


//access chat
router.post("/",accessChat)


module.exports = router