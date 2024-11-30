// Import Modules
const express = require("express");

// Import Controller
const productController = require("../controller/product");

const router = express.Router();

router.get("", productController.getProducts);

router.get("/detail/:productId", productController.getProductDetail);

router.get("/query", productController.getProductsByQueries);

module.exports = router;
