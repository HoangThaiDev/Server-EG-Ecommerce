// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  cart_detail: {
    items: [
      {
        itemId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "product",
        },
        quantity_item: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPriceCart: {
      type: Number,
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

module.exports = mongoose.model("cart", cartSchema);
