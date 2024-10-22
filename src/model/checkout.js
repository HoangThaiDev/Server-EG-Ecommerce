// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const checkoutSchema = new Schema({
  selectedItems: {
    item: [
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
        priceItem: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },

  info_client: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("checkout", checkoutSchema);
