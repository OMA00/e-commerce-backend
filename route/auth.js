const express = require("express");
const authController = require("../controllers/authContoller");
const router = express.Router();

//public
router.post("/register", authController.register);

module.exports = router;
