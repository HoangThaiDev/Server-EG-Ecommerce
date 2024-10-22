const { Schema, default: mongoose } = require("mongoose");

const guestSchema = new Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

exports.modules = mongoose.model("guest", guestSchema);
