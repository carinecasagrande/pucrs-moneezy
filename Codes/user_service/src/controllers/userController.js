const i18n = require("i18n");
const { CustomError } = require("../errors/customError");
const {
  signup,
  login,
  requestNewPassword,
  changePassword,
  deleteAccount,
  logout,
  update,
  verifyChangePasswordToken,
} = require("../services/userService");
const { saveLog } = require("../services/logService");
const { generateAccessToken } = require("../services/authService");

/**
 * Handles user account creation.
 */
const actionSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await signup(username, email, password);

    await saveLog(req, "signup", user.user_id);

    res.status(201).json({
      code: 201,
      message: i18n.__("signup_success"),
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "signup_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

/**
 * Handles user login.
 */
const actionLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);

    const accessToken = await generateAccessToken(req, user);
    await saveLog(req, "login", user.user_id);

    res.status(200).json({
      code: 200,
      message: i18n.__("login_success"),
      token: accessToken,
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "login_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

/**
 * Handles password change request
 */
const actionRequestNewPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await requestNewPassword(email);

    await saveLog(req, "requestNewPassword", user.user_id);

    res.status(200).json({
      code: 200,
      message: i18n.__("requestNewPassword_success"),
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "requestNewPassword_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

/**
 * Handles password changes for users who have requested a reset.
 */
const actionChangePassword = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;

    const tokenInfo = await verifyChangePasswordToken(req);

    await changePassword(tokenInfo, password, password_confirmation);

    await saveLog(req, "changePassword", tokenInfo.user_id);

    res.status(200).json({
      code: 200,
      message: i18n.__("changePassword_success"),
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "changePassword_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

/**
 * Delete an account.
 */
const actionDelete = async (req, res) => {
  try {
    deleteAccount(req.user.id);

    res.status(200).json({
      code: 200,
      message: i18n.__("deleteAccount_success"),
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "deleteAccount_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

/**
 * Logs out the user
 */
const actionLogout = async (req, res) => {
  try {
    const user_id = req.user.id;

    await logout(user_id);
    await saveLog(req, "logout", user_id);

    res.status(200).json({
      code: 200,
      message: i18n.__("logout_success"),
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "logout_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

/**
 * Updates a user's data.
 */
const actionUpdate = async (req, res) => {
  try {
    const { username, email, password, password_confirmation } = req.body;
    const user_id = req.user.id;

    const user = await update(
      user_id,
      username,
      email,
      password,
      password_confirmation
    );

    await saveLog(req, "update", user.user_id);

    const accessToken = await generateAccessToken(req, user, true);

    res.status(200).json({
      code: 200,
      message: i18n.__("update_success"),
      token: accessToken,
      result: "success",
    });
  } catch (error) {
    var code = 500;
    var message = "update_error";

    if (error instanceof CustomError) {
      code = error.statusCode;
      message = error.message;
    }

    res.status(code).json({
      code: code,
      message: i18n.__(message),
      result: "error",
    });
  }
};

module.exports = {
  actionSignup,
  actionLogin,
  actionRequestNewPassword,
  actionChangePassword,
  actionDelete,
  actionLogout,
  actionUpdate,
};
