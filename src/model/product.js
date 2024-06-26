// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "category",
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  percent_discount: {
    type: Number,
    required: true,
  },
  best_seller: {
    type: Boolean,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  desc_detail: {
    short: {
      type: String,
      required: true,
    },
    long: {
      type: Array,
      required: true,
    },
  },
  expiry_date: {
    fozen: {
      type: String,
      required: true,
    },
    outside: {
      type: String,
      required: true,
    },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("product", productSchema);
