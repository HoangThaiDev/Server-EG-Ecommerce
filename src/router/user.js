// Import Modules
const express = require("express");

// Import Middlewares
const isAuth = require("../middleware/is-auth");

// Import Controller
const userController = require("../controller/user");

const router = express.Router();

router.get("/", userController.getUser);

router.post("/register", userController.postRegisterUser);

router.post("/login", userController.postLoginUser);

router.get("/logout", isAuth.isAuthentication, userController.getLogout);

module.exports = router;
