const User = require("../models/User.models");
const jwt = require("jsonwebtoken");

//Helper functions to create tokens

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

//Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
  } catch (error) {}
};
