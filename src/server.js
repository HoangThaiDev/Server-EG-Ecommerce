// Import Modules
const express = require("express");
const cors = require("cors");
const app = express();
const { corsOptions } = require("./config/enviroment");
const mongooseConnect = require("./utils/database");
const env = require("./config/enviroment");

// Import Routers
const categoryRouter = require("./router/category");
const productRouter = require("./router/product");
const userRouter = require("./router/user");

// Create + use Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.set("trust proxy", 1); // Đảm bảo thông tin IP address chính xác

// Create middleware to add Headers CORS
app.use((req, res, next) => {
  // Kiểm tra nếu origin nằm trong WHITELIST_DOMAINS_PRODUCTION
  if (
    env.BUILD_MODE === "production" &&
    WHITELIST_DOMAINS_PRODUCTION.includes(origin)
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (
    env.BUILD_MODE === "dev" &&
    WHITELIST_DOMAINS_DEV.includes(origin)
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // Nếu không phải origin hợp lệ thì không thiết lập header
    res.header("Access-Control-Allow-Origin", "null");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Origin", origin);
  next();
});

// Create Server DBS + Connect Server
const connectServerWithDbs = () => {
  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, (err) => {
      console.log(
        `Production: Hi ${env.AUTHOR}. Start server at port: ${process.env.PORT}`
      );
    });
  } else {
    app.listen(env.LOCAL_APP_PORT, (err) => {
      console.log(
        `Localdev: Hi ${env.AUTHOR}. Start server at host: ${env.LOCAL_APP_HOST} and port: ${env.LOCAL_APP_PORT}`
      );
    });
  }
};

mongooseConnect(connectServerWithDbs);

/// Use Route Endpoint
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);
