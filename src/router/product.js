// Import Modules
const express = require("express");
const router = express.Router();

// Import Controller
const productController = require("../controller/product");

router.get("", productController.getProducts);

router.get("/detail/:productId", productController.getProductDetail);

router.get("/query", productController.getProductsByQueries);

router.post("/add-to-cart", productController.postAddProductToCart);

module.exports = router;
