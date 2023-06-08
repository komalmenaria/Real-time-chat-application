const express = require("express");
const router = express.Router()
const {registerUser,authUser , allUsers} = require("../controllers/userControllers")
const {protect} = require("../middlewares/authMiddleware")

router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/allUsers').get(protect,allUsers)


module.exports = router