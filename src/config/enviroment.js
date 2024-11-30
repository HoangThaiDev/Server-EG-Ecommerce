require("dotenv").config();

const env = {
  MONGODB_URI_SERVER: process.env.MONGODB_URI_SERVER,
  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST,
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  AUTHOR: process.env.AUTHOR,
  BUILD_MODE: process.env.BUILD_MODE,
  ACCESSTOKEN: process.env.ACCESSTOKEN,
  REFRESHTOKEN: process.env.REFRESHTOKEN,
};

module.exports = env;
