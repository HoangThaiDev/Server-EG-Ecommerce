// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const reviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "product",
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "category",
    },
    desc_detail: {
      content: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
    info_client: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
