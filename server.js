//import the packages we installed //
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./route/auth");
const cors = require("cors");

// Enable usage of .env files - this must always be at the topmost part of your server/app/index .js file
require("dotenv").config();

// Create the express app

const app = express();

// set up middlewares (code that runs for every request)
app.use(cors());
app.use(express.json());

// Our port

const PORT = process.env.PORT || 5000;

//Create endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    maessage: "Hello! this is the home endpoint of our backend",
    data: {
      name: "e-commerce-backend data",
      class: "Feb 2025",
      efficiency: "Beginner",
    },
  });
});

//actual endpoints
app.use("/api/auth", authRoutes);
app.post("/api/auth/register", (req, res) => {
  res.status(200).json({
    message: "Success! The route is working.",
  });
});

// Connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection successful ");
  } catch (error) {
    console.error("DB connection failed:", error.message);
  }
};

connectDB();

//Start server
app.listen(PORT, () => {
  console.log(`Serving running at ${PORT}`);
});
