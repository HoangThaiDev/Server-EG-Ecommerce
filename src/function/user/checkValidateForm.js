// Import Modules
const Joi = require("joi");

exports.checkFormRegister = (valuesForm) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({ "string.empty": "FirstName is not allowed to be empty!" }),
    lastName: Joi.string()
      .required()
      .messages({ "string.empty": "LastName is not allowed to be empty!" }),
    email: Joi.string()
      .required()
      .pattern(new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", "i"))
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.pattern.base": "Email must be valid",
      }),
    password: Joi.string().required().min(4).messages({
      "string.empty": "Password is not allowed to be empty!",
      "string.min": "Password length must be at least 4 characters long!",
    }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Password must match!",
    }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = schema.validate(
    {
      firstName: valuesForm.firstName,
      lastName: valuesForm.lastName,
      email: valuesForm.email,
      password: valuesForm.password,
      confirmPassword: valuesForm.confirmPassword,
    },
    { abortEarly: false } // Tiếp tục kiểm tra lỗi chứ ko có dừng sau khi tìm thấy
  );
  console.log(error);

  if (error) {
    // Return an array of all error messages
    const errorMessages = error.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
      showError: true,
      type: detail.type,
    }));
    return errorMessages;
  }
  return true;
};

exports.checkFormLogin = (valuesForm) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .pattern(new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", "i"))
      .messages({
        "string.empty": "Email is not allowed to be empty!",
        "string.pattern.base": "Email must be valid",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password is not allowed to be empty!",
    }),
  });

  // Dữ liệu form và lấy lỗi nếu có
  const { error } = schema.validate(
    {
      email: valuesForm.email,
      password: valuesForm.password,
    },
    { abortEarly: false } // Tiếp tục kiểm tra lỗi chứ ko có dừng sau khi tìm thấy
  );
  console.log(error);

  if (error) {
    // Return an array of all error messages
    const errorMessages = error.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
      showError: true,
      type: detail.type,
    }));
    return errorMessages;
  }
  return true;
};
