const express = require("express");
const {register} = require("../controllers/authContoller");
const router = express.Router();

//public
router.post("/register", register);

module.exports = router;
