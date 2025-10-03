const mongoose = require("mongoose");
const { DB_URI } = require("./config");

class Database {
  constructor(uri) {
    this.uri = uri;
    this.connection = null;
    this.models = {};
  }

  // Connect to MongoDB
  async connect() {
    try {
      if (!this.connection) {
        this.connection = await mongoose.connect(this.uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected");
      }
      return this.connection;
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
      throw err;
    }
  }

  // Disconnect from MongoDB
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        console.log("🔌 MongoDB disconnected");
      }
    } catch (err) {
      console.error("❌ MongoDB disconnection error:", err.message);
      throw err;
    }
  }

  // Define a model dynamically
  defineModel(name, schemaDefinition, options = {}) {
    if (!this.models[name]) {
      const schema = new mongoose.Schema(
        schemaDefinition,
        { timestamps: true, ...options }
      );
      this.models[name] = mongoose.model(name, schema);
    }
    return this.models[name];
  }

  // Get a model
  getModel(name) {
    const model = this.models[name];
    if (!model) {
      throw new Error(`Model "${name}" is not defined. Did you call defineModel()?`);
    }
    return model;
  }

  // Generic CRUD helpers
  async create(modelName, data) {
    const model = this.getModel(modelName);
    const doc = new model(data);
    return await doc.save();
  }

  async findOne(modelName, query) {
    const model = this.getModel(modelName);
    return await model.findOne(query);
  }

  async findAll(modelName, query = {}, projection = null, options = {}) {
    const model = this.getModel(modelName);
    return await model.find(query, projection, options);
  }

  async updateById(modelName, id, update, options = { new: true }) {
    const model = this.getModel(modelName);
    return await model.findByIdAndUpdate(id, update, options);
  }

  async deleteById(modelName, id) {
    const model = this.getModel(modelName);
    return await model.findByIdAndDelete(id);
  }
}

// Export singleton
const db = new Database(DB_URI);
module.exports = db;
