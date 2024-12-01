// Import Modules
const router = require("express").Router();

// Import Middlewares
const { isAuthentication } = require("../middleware/is-auth");

// Import Components
const cartController = require("../controller/cart");

router.post("/add-to-cart", isAuthentication, cartController.postAddToCart);

router.delete(
  "/product/:productId",
  isAuthentication,
  cartController.deleteProductFromCart
);

module.exports = router;
