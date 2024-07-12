// Import Modules
const express = require("express");
const router = express.Router();

// Import Controller
const categoryController = require("../controller/category");

router.get("", categoryController.getCategories);

module.exports = router;
