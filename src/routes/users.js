const express = require("express");
const bcrypt = require("bcrypt");
const authenticate = require("../middleware/authenticate"); 
const db = require("../db");

const router = express.Router();

// ===================== SELF ROUTES =====================

// Get my profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await db.getModel("users")
      .findById(req.user._id)
      .select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update my profile
router.put("/me", authenticate, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const user = await db.getModel("users")
      .findByIdAndUpdate(req.user._id, { $set: updates }, { new: true })
      .select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete my account (cannot delete if admin)
router.delete("/me", authenticate, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admin cannot delete self" });
    }

    await db.getModel("users").findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===================== ADMIN ROUTES =====================

// Get all users (admin only)
router.get("/", authenticate, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

  try {
    const users = await db.getModel("users").find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update any user (or self)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const updates = {};

    // Find target user
    const targetUser = await db.getModel("users").findById(id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // Normal user can only update self
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Forbidden: cannot update other users" });
    }

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    // Admin cannot change their own role
    if (role && req.user.role === "admin" && req.user._id.toString() !== id) {
      updates.role = role;
    }

    const updatedUser = await db.getModel("users")
      .findByIdAndUpdate(id, { $set: updates }, { new: true })
      .select("-password");

    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user (self or admin rules)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await db.getModel("users").findById(id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // Normal user can only delete self, cannot delete admin
    if (req.user.role !== "admin") {
      if (req.user._id.toString() !== id) {
        return res.status(403).json({ error: "Forbidden: cannot delete other users" });
      }
      if (targetUser.role === "admin") {
        return res.status(403).json({ error: "Forbidden: cannot delete admin" });
      }
    }

    // Admin cannot delete self
    if (req.user.role === "admin" && req.user._id.toString() === id) {
      return res.status(403).json({ error: "Admin cannot delete self" });
    }

    await db.getModel("users").findByIdAndDelete(id);
    res.json({ message: "User deleted", userId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
