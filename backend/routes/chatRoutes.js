const express = require("express");
const router = express.Router()
const {protect} = require("../middlewares/authMiddleware")
const { accessChat ,fetchChat ,createGroupChat ,renameGroup} = require("../controllers/chatControllers")


router.route('/accessOrCreateChat').post(protect,accessChat)
router.route('/fetchChat').get(protect,fetchChat)
router.route('/createGroup').post(protect,createGroupChat)
router.route('/renameGroup').put(protect,renameGroup)
// router.route('/removeFromGroup').put(protect,removeFromGroup)
// router.route('/addToGroup').put(protect,addToGroup)



module.exports = router