// Import Modules
const router = require("express").Router();

// Import Middlewares
const { isAuthentication } = require("../middleware/is-auth");

// Import Components
const checkoutController = require("../controller/checkout");

router.post("/create", isAuthentication, checkoutController.postCreateCheckout);

router.post(
  "/add-info",
  isAuthentication,
  checkoutController.postUpdateInfoClientOfCheckout
);

router.get("/", isAuthentication, checkoutController.getCheckout);

module.exports = router;
