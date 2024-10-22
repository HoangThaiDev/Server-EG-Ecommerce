// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const orderSchema = new Schema({
  checkoutId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "checkout",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
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
module.exports = mongoose.model("order", orderSchema);
