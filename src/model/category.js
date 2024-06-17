// Import Modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  logo: {
    outline: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("category", categorySchema);
