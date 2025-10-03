const db = require("../db");

// Define the Product model schema
const Product = db.defineModel("products", {
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  description: { 
    type: String, 
    default: "" 
  },
  stock: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  category: { 
    type: String, 
    default: "general" 
  }
});

module.exports = { Product };
