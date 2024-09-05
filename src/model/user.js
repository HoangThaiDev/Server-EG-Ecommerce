// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/dqrughrs2/image/upload/v1725449436/anh-avatar-trang-tron_zjz4ke.jpg",
  },
  info_detail: {
    age: Number,
    address: String,
    city: String,
    phoneNumber: Number,
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

module.exports = mongoose.model("user", userSchema);
