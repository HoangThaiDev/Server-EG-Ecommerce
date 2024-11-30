// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
      ref: "category",
    },
    price: {
      type: String,
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
    rating: {
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
    desc: {
      short: {
        type: String,
        required: true,
      },
      long: {
        type: Array,
        required: true,
      },
    },
    manufacacturing_date: {
      type: String,
      required: true,
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
    image_detail: {
      banner: {
        type: String,
        required: true,
      },
      images: {
        type: Array,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
