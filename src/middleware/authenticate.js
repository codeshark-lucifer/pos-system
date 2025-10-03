const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { db } = require("../models/users");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await db.findOneByEmail("users", payload.email);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.activeTokens.includes(token)) {
      return res.status(401).json({ error: "Token is invalid or expired" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
