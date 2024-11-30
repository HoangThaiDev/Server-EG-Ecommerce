// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const checkoutSchema = new Schema(
  {
    cart: {
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
          priceItem: {
            type: String,
            required: true,
          },
        },
      ],
      totalPriceCart: {
        type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("checkout", checkoutSchema);
