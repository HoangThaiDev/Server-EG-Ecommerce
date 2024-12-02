// Import Models
const User = require("../model/user");
const Cart = require("../model/cart");

// Import Modules
const env = require("../config/enviroment");
const bcrypt = require("bcrypt");

// Import Func Helpers
const checkValidateForm = require("../helper/user/checkValidateForm");
const jwt = require("../helper/user/jwt");
const { getCart } = require("../helper/cart/getCart");

// Create Controllers Action
exports.postRegisterUser = async (req, res) => {
  const valuesForm = req.body;

  try {
    // Check validate values form
    const isFormValid = checkValidateForm.checkFormRegister(valuesForm);
    if (!isFormValid) {
      return res.status(400).json({ message: "Info Input Invalid!" });
    }

    // Check email was existed in database
    const findedUser = await User.findOne({ email: valuesForm.email });

    if (findedUser) {
      return res
        .status(400)
        .json({ message: "Email was used. Please choose another email!" });
    }

    // Use bcrypt to hash password
    const hashedPassword = await bcrypt.hash(valuesForm.password, 12);

    if (!hashedPassword) {
      return res.status(500).json({ message: "Interval Server Error!" });
    }

    // Create Account User
    const newUser = new User({
      firstname: valuesForm.firstName,
      lastname: valuesForm.lastName,
      email: valuesForm.email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "Register Failled!" });
    }

    const result = await newUser.save();

    if (!result) {
      return res.status(400).json({ message: "Register Failled!" });
    }

    res.status(201).json({ message: "Register Success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postLoginUser = async (req, res) => {
  const valuesForm = req.body;

  try {
    // Check validate values form
    const isFormValid = checkValidateForm.checkFormLogin(valuesForm);
    if (!isFormValid) {
      return res.status(400).json({ message: "Info Input Invalid!" });
    }

    // Check client input right email or password
    const findUser = await User.findOne({
      email: valuesForm.email,
    });

    if (!findUser) {
      return res
        .status(401)
        .json({ message: "Email or password is wrong. Please try again!" });
    }

    const doMatch = await bcrypt.compare(
      valuesForm.password,
      findUser.password
    );

    if (!doMatch) {
      return res
        .status(401)
        .json({ message: "Email or password is wrong. Please try again!" });
    }

    // // Check account client is input was used
    // if (findUser.state.refresh_token !== "") {
    //   return res.status(401).json({ message: "Your account was using!" });
    // }

    // Create accessToken + refreshToken
    const newAccessToken = await jwt.generateAccessToken(
      findUser._id,
      env.ACCESSTOKEN
    );
    const newRefreshToken = await jwt.generateRefreshToken(
      findUser._id,
      env.REFRESHTOKEN
    );

    if (!newAccessToken || !newRefreshToken) {
      throw new Error("JWT is not working!");
    }

    // Check client has cart or not

    const findCartByUserId = await Cart.findOne({
      userId: findUser._id,
    }).populate("cart_detail.items.itemId");

    const modifiedCart = await getCart(findUser._id);

    if (!findCartByUserId) {
      const newCart = new Cart({
        userId: findUser._id,
        cart_detail: { items: [], totalPriceCart: "0" },
      });

      if (!newCart) {
        return res.status(400).json({ message: "Login Failled!" });
      }

      const saveNewCart = await newCart.save();

      if (!saveNewCart) {
        return res.status(400).json({ message: "Login Failled!" });
      }
    }

    // Save RefreshToken in database

    findUser.state.refresh_token = newRefreshToken;
    const updateUser = await findUser.save();

    if (!updateUser) {
      res.status(500).json({ message: "Interval Server Error!" });
    }

    // Response accessToken & refreshtoken about client
    res.cookie("refreshToken_client", newRefreshToken, {
      secure: env.BUILD_MODE === "dev" ? false : true,
      httpOnly: true,
      sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
    });

    res.status(200).json({
      accessToken: newAccessToken,
      info_detail: findUser.info_detail,
      isLoggedIn: true,
      cart: {
        items: findCartByUserId ? modifiedCart.items : [],
        totalPriceCart: findCartByUserId ? modifiedCart.totalPriceCart : "0",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken_client;

  try {
    // If refreshToken undefined => user not loggin
    if (!refreshToken) {
      return res.status(203).json({ message: "User not loggin" });
    }

    // Find user current by refresh token
    const findUser = await User.findOne({
      ["state.refresh_token"]: refreshToken,
    }).select({ info_detail: 1, state: 1 });

    if (!findUser) {
      return res.status(401).json({ message: "Session is expired!" });
    }

    // Check refreshToken is expired or not
    const decodedRefreshToken = await jwt.verifyRefreshToken(
      findUser.state.refresh_token,
      env.REFRESHTOKEN
    );

    if (decodedRefreshToken === "RefreshToken Expired") {
      findUser.state.refresh_token = "";
      await findUser.save();
      res.clearCookie("refreshToken_client", {
        secure: env.BUILD_MODE === "dev" ? false : true,
        httpOnly: true,
        sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
      });
      return res.status(401).json({ message: "Session is expired!" });
    }

    // Get cart from database
    const newCart = await getCart(findUser._id);

    // Create accessToken
    const newAccessToken = await jwt.generateAccessToken(
      findUser._id,
      env.ACCESSTOKEN
    );

    if (!newAccessToken) {
      throw new Error("JWT is not working!");
    }

    res.status(200).json({
      accessToken: newAccessToken,
      info_detail: findUser.info_detail,
      isLoggedIn: true,
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getLogout = async (req, res) => {
  const userId = req.user;

  try {
    const findUser = await User.findOne({ _id: userId });

    // Update state => delete refreshToken
    findUser.state.refresh_token = "";

    const result = await findUser.save();

    if (!result) {
      return res.status(400).json({ message: "Something wrong!" });
    }

    res.clearCookie("refreshToken_client", "", {
      secure: env.BUILD_MODE === "dev" ? false : true,
      httpOnly: true,
      sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
    });
    res.status(200).json({ message: "Logout Success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};
