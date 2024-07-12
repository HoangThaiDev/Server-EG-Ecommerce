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

// Create + use Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.set("trust proxy", 1); // Đảm bảo thông tin IP address chính xác

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
