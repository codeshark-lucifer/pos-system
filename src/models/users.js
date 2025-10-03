const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "Anonymous",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  activeTokens: {
    type: [String], // store JWTs for logout/active session control
    default: [],
  },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true });

const User = mongoose.model("users", userSchema);

module.exports = { User };
