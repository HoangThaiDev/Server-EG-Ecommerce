// Import Modules
const router = require("express").Router();

// Import Middlewares
const { isAuthentication } = require("../middleware/is-auth");

// Import Components
const orderController = require("../controller/order");

router.get("/order", isAuthentication, orderController.getOrder);

module.exports = router;
