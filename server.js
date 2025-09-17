const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./route/auth");
const productRoutes = require("./route/product");
const cors = require("cors");

//Enable the use of the dotenv files - this must always be on the topmost part of index/app/server .js file
require("dotenv").config();

//Create the express app
const app = express();

//Create the middlewares (code that runs for every requests)

app.use(cors());
app.use(express.json());

//Our Port

const PORT = process.env.PORT || 5000;

//Create endpoint

app.get("/", (req, res) => {
  res.status(200).json({
    success: " Hello ! this is the home end point of our backend",
    data: {
      name: "e-commerce-backend datum",
      class: "Feb 2025 class",
      efficiency: "Intermediate",
    },
  });
});

//actual endpoints
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

//Connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connection successful");
  } catch (error) {
    console.error("DB Connection failed:", error.message);
  }
};

connectDB();

//Start server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
