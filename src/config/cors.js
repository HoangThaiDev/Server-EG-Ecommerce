// Import Modules
const {
  WHITELIST_DOMAINS_DEV,
  WHITELIST_DOMAINS_PRODUCTION,
} = require("../utils/constants");
const env = require("./enviroment");

exports.corsOptions = {
  origin: function (origin, callback) {
    // Nếu môi trường là dev, cho phép tất cả các origin trong whitelist
    if (env.BUILD_MODE === "dev" && WHITELIST_DOMAINS_DEV.includes(origin)) {
      return callback(null, true);
    }

    // Nếu môi trường là production, kiểm tra xem origin có trong whitelist không
    // if (
    //   env.BUILD_MODE === "production" &&
    //   WHITELIST_DOMAINS_PRODUCTION.includes(origin)
    // ) {
    //   return callback(null, true);
    // }
    // Trường hợp không hợp lệ (thường không xảy ra trong dev)
    callback(new Error("Not allowed by CORS"));
  },

  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ["x-access-token"],
};
