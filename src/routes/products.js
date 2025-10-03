const express = require("express");
const { Product } = require("../models/products");
const authenticate = require("../middleware/authenticate")
const authorize = require("../middleware/authorize");

const router = express.Router();

/**
 * @route   POST /product/create
 * @desc    Create a new product
 */

// Create product (admin only)
router.post("/create", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const product = new Product({ name, price, description, stock, category });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /product/update/:id
 * @desc    Update an existing product
 */
// Update product (admin only)
router.put("/update/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /product/remove/:id
 * @desc    Remove a product
 */

// Delete product (admin only)
router.delete("/remove/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product removed successfully", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /product/list
 * @desc    Get all products (with optional search + pagination)
 * @query   ?page=1&limit=10&name=abc
 */

// List products 
router.get("/list", authenticate, async (req, res) => {
  try {
    let { page = 1, limit = 10, name } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      message: "Products fetched successfully",
      page,
      limit,
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

module.exports = router;
