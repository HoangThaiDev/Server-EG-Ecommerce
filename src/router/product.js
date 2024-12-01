// Import Modules
const router = require("express").Router();

// Import Controller
const productController = require("../controller/product");

router.get("", productController.getProducts);

router.get("/detail/:productId", productController.getProductDetail);

router.get("/query", productController.getProductsByQueries);

module.exports = router;
