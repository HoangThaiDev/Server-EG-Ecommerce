// Import Modules
const router = require("express").Router();

// Import Controller
const categoryController = require("../controller/category");

router.get("", categoryController.getCategories);

module.exports = router;
