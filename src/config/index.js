require("dotenv").config();
const rateLimit = require("express-rate-limit");

// Rate limiter: protects against brute-force & DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: "Too many requests, try again later",
});

if (!process.env.DB_URI) {
  console.warn("⚠️ Warning: DB_URI not set in environment variables");
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "1h",
  DB_URI: process.env.DB_URI,
  LIMITER: limiter, // fixed typo
};
