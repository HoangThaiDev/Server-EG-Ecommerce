// Import Modules
const express = require("express");
const cors = require("cors");
const app = express();
const { corsOptions } = require("./config/cors");
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

app.use(function (req, res, next) {
  if (env.BUILD_MODE === "dev") {
    res.header("Access-Control-Allow-Origin", env.URL_CLIENT_LOCAL);
  }
  if (env.BUILD_MODE === "production") {
    res.header("Access-Control-Allow-Origin", env.URL_CLIENT_PRODUCTION);
  }

  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
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
