// Import Modules
const { WHITELIST_DOMAINS } = require("../utils/constants");
const env = require("./enviroment");

exports.corsOptions = {
  origin: function (origin, callback) {
    if (env.BUILD_MODE === "dev") {
      return callback(null, true);
    }
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }
  },

  optionsSuccessStatus: 200,
  credentials: true,
};
