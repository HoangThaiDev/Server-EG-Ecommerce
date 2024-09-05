// Import Models
const User = require("../model/user");

// Import Func Helper
const checkValidateForm = require("../function/user/checkValidateForm");

// Create Controllers Action
exports.postRegisterUser = (req, res) => {
  const { valuesForm } = req.body;

  //   Check Validate Form
  const result = checkValidateForm.checkFormRegister(valuesForm);
  if (!result) {
    res.status(400).json({ message: "Register Failled!" });
    return false;
  }

  //   Create Account User
  const userAccount = new User({
    firstname: valuesForm.firstName,
    lastname: valuesForm.lastName,
    email: valuesForm.email,
    password: valuesForm.password,
  });

  res.status(201).json({ message: "Register Success!" });
  return userAccount.save();
};

exports.postLoginUser = async (req, res) => {
  const { valuesForm } = req.body;
  //   Check Validate Form
  const result = checkValidateForm.checkFormLogin(valuesForm);
  if (!result) {
    res.status(400).json({ message: "Login Failled!" });
    return false;
  }

  const user = await User.findOne({
    email: valuesForm.email,
    password: valuesForm.password,
  });

  // Check client input right email or password
  if (!user) {
    res
      .status(401)
      .json({ message: "Email or password is wrong. Please try again!" });
    return false;
  }

  res.status(200).json(user);
};
