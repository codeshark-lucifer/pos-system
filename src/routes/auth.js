const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const authenticate = require("../middleware/authenticate");
const { JWT_SECRET, JWT_EXPIRE, LIMITER } = require("../config");
const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword, role: "user" });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 * @note    Optional rate limiting applied
 */
router.post("/login", LIMITER, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    // Save token and update last login
    user.activeTokens.push(token);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: "Login successful",
      token,
      expiresIn: JWT_EXPIRE,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /auth/logout
 * @desc    Logout user (remove current token)
 * @access  Private
 */
router.post("/logout", authenticate, async (req, res) => {
  try {
    req.user.activeTokens = req.user.activeTokens.filter(t => t !== req.token);
    await req.user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
