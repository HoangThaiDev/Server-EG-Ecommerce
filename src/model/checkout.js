// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const checkoutSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    cart: {
      items: {
        type: Array,
        required: true,
      },
      totalPriceCart: {
        type: String,
        required: true,
      },
    },

    info_client: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      district: {
        type: String,
        default: "",
      },
      commune: {
        type: String,
        default: "",
      },
      phoneNumber: {
        type: String,
        default: "",
      },
      note: {
        type: String,
        default: "Empty Note!",
      },
    },

    method_payment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("checkout", checkoutSchema);
