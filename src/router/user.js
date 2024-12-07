// Import Modules
const router = require("express").Router();

// Import Middlewares
const isAuth = require("../middleware/is-auth");

// Import Controller
const userController = require("../controller/user");

router.get("/user", userController.getUser);

router.post("/register", userController.postRegisterUser);

router.post("/login", userController.postLoginUser);

router.get("/logout", isAuth.isAuthentication, userController.getLogout);

module.exports = router;
