// Import Modules
const express = require("express");
const router = express.Router();

// Import Controller
const productController = require("../controller/product");

router.get("", productController.getProducts);

router.post("/detail/:productId", productController.postGetProductDetail);

router.get("/search", productController.postSearchProductByOptions);

module.exports = router;
