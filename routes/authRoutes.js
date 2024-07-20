const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller")

router.post("/signup", authController.userSignupPost);
router.post("/login",authController.userLoginPost)
router.post("/google-signup", authController.googleSignupPost);
router.post("/google-login", authController.googleLoginPost);



module.exports = router;
