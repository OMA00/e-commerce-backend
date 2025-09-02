const Product = require("../models/Product.models");
const mongoose = require("mongoose");

const getAllproducts = async (req, res) => {
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

    // filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$gte = Number(maxPrice);
    }

    if (inStock == "true") {
      filter.inStock = true;
      filter.stockQuantity = { $gt: 0 };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    //Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build  sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // // Execute Query
    // const products = await Product.find(filter)
    //   .populate("createdBy", "name email")
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(Number(limit));

    // // get total counts for pagination
    // const total = await Product.countDocuments(filter);

    // Replace those two lines with this:
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("created by ", "name email")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNextPage: skip + product.length < total,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!Product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product found",
      data: product,
    });
  } catch (error) {
    console.log(error.message);
    //SKU unique
    if (error.code == 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching message",
      error: error.message,
    });
  }
};
