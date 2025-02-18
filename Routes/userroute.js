const express = require("express");
const Controller = require("../Controllers/userController");
const verifyOTP = require("../Controllers/Verifyotp");
const otpattempts = require("../Middlewares/otpattempts")
const authMiddleware = require("../Middlewares/authMiddleware");
const siginupmiddleware = require("../Middlewares/siginupmiddleware")
const router = express.Router();

router.post("/signup",siginupmiddleware,Controller.signup);
router.post("/deleteuser",Controller.deleteUser);
router.post("/signin",Controller.signin);
router.get("/getallusers",Controller.getAllUsers);
router.post("/verifyotp",otpattempts,verifyOTP);

module.exports = router