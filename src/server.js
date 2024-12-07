// Import Modules
const express = require("express");
const cors = require("cors");
const { corsOptions } = require("./config/cors");
const mongooseConnect = require("./utils/database");
const env = require("./config/enviroment");
const cookieParser = require("cookie-parser");
const app = express();

// Import Routers
const categoryRouter = require("./router/category");
const productRouter = require("./router/product");
const userRouter = require("./router/user");
const cartRouter = require("./router/cart");
const checkoutRouter = require("./router/checkout");
const orderRouter = require("./router/order");

// Create + use Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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
app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/checkouts", checkoutRouter);
app.use("/orders", orderRouter);
