const express = require("express");
const db = require("./db");
const { DB_URI } = require("./config");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");

const app = express();
app.use(express.json());

// Connect to DB
(async () => {
  await db.connect(DB_URI);

  // Routes
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/products", productRoutes)

  app.listen(3000, () => console.log("🚀 Server running on http://127.0.0.1:3000"));
})();
