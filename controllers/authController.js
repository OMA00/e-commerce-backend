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

    //Check if the user already exists
    const existingUser = await User.findOne({ email });

    //if true send an error message
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user with this email already exists",
      });
    }

    //if email is not found in the database
    const user = new User({ name, email, password });
    await user.save();

    //create token for users.
    const token = createToken(user._id);

    //send response
    res.status(201).json({
      success: true,
      message: "User succesfully created",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Encountered errors registering the users please try again later",
      error: error.message,
    });
  }
};

//Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create token
    const token = createToken(user._id);

    //Send response
    res.status(200).json({
      success: true,
      message: "Login Successful ",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Logging In",
      error: error.message,
    });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    // // req.user is set by auth middleware
    ////const user = await User.findById(req.user._id).select("-password");

    const user = req.user;
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting profile",
      error: error.message,
    });
  }
};
module.exports = { register, login, getProfile };
