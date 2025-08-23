const Product = require("../models/Product.models");
const mongoose = require("mongoose");

const getAllproducts = (req, res) => {
  try {
    // query the current product catalogue from the database
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;
  } catch (error) {}
};
