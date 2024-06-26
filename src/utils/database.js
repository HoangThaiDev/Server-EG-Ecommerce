// Import Modules
const mongoose = require("mongoose");
const env = require("../config/enviroment");

const mongooseConnect = (callback) => {
  mongoose
    .connect(env.MONGODB_URI_SERVER)
    .then((result) => {
      console.log(`Connected to server ${env.DATABASE_NAME} successfully`);
      callback();
    })
    .catch((err) => console.log(err));
};

module.exports = mongooseConnect;
