const express = require('express');
const router = express.Router()
const {protect} = require("../middlewares/authMiddleware")
const { sendMessage, allMessages } = require("../controllers/messageControllers")

router.route('/sendMessage').post(protect,sendMessage)
router.route('/allMessages/:chatId').get(protect,allMessages)

module.exports = router