const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller")

router.post("/signup", authController.userSignupPost);


module.exports = router;
