// Import Modules
const express = require("express");
const router = express.Router();

// Import Controller
const userController = require("../controller/user");

router.post("/register", userController.postRegisterUser);

router.post("/login", userController.postLoginUser);

module.exports = router;
