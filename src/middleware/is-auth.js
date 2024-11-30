// Import Modules
const jwt = require("../helper/user/jwt");
const env = require("../config/enviroment");

// Import Modules
const User = require("../model/user");

exports.isAuthentication = async (req, res, next) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  const refreshToken = req.cookies.refreshToken_client;

  // Check accessToken and refreshToken exist or not
  if (!accessToken || !refreshToken) {
    return res.status(500).json({ message: "Interver Server Error!" });
  }

  // Decode accessToken & refreshToken
  const decodedAccessToken = await jwt.verifyAccessToken(
    accessToken,
    env.ACCESSTOKEN
  );
  const decodedRefreshToken = await jwt.verifyRefreshToken(
    refreshToken,
    env.REFRESHTOKEN
  );

  // Check accessToken is expired or not
  if (decodedAccessToken === "AccessToken Expired") {
    // Check refreshToken is expired or not
    if (decodedRefreshToken === "RefreshToken Expired") {
      const findUser = await User.findOne({
        "state.refresh_token": refreshToken,
      });
      findUser.state.refresh_token = "";
      await findUser.save();
      res.clearCookie("refreshToken_client", {
        httpOnly: true,
        sameSite: "lax",
      });
      return res.status(401).json({ message: "Session is expired!" });
    } else {
      const newAccessToken = await jwt.generateAccessToken(
        decodedRefreshToken.userId,
        env.ACCESSTOKEN
      );

      res.setHeader("x-access-token", newAccessToken);
      req.user = decodedRefreshToken.userId;
      return next();
    }
  } else {
    req.user = decodedAccessToken.userId;
    next();
  }
};
