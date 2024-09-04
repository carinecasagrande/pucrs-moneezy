const { CustomError } = require("../errors/customError");
const {
  validateSignup,
  checkIfEmailAlreadyRegistered,
  validateLogin,
  validateRequestNewPassword,
  validateChangePassword,
  validateUpdate,
} = require("../helpers/validation");
const { User, PasswordReset } = require("../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { loadEmailTemplate, sendEmail } = require("../helpers/mail");
const config = require("../config/config");
const i18n = require("i18n");
const { Op } = require("sequelize");
const validator = require("validator");
const { revokeTokens } = require("./authService");

/**
 * Handles user account creation.
 */
const signup = async (username, email, password) => {
  validateSignup(username, email, password);
  await checkIfEmailAlreadyRegistered(email);

  const password_hash = await encryptPassword(password);
  return await User.create({ username, email, password_hash });
};

/**
 * Encrypts the user's password.
 */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Handles user login.
 */
const login = async (email, password) => {
  validateLogin(email, password);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new CustomError("user_not_found", 400);
  }

  if (!(await user.checkPassword(password))) {
    throw new CustomError("password_incorrect", 401);
  }

  return user;
};

/**
 * Find a user by email.
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

/**
 * Handles password change request
 */
const requestNewPassword = async (email) => {
  validateRequestNewPassword(email);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new CustomError("user_not_found", 400);
  }

  const reset_token = await generateResetPasswordToken(user);
  const link = `${config.endpoint.clientInterface}reset-password?token=${reset_token}`;
  const subject = i18n.__("requestNewPassword_subject");
  const minutes = config.settings.minutes_to_password_reset_token_expire;

  const body = await loadEmailTemplate("reset-password", i18n.getLocale(), {
    link,
    username: user.username,
    minutes,
  });

  try {
    await sendEmail(user.email, subject, body);
  } catch (error) {
    throw new CustomError("email_error", 500);
  }

  return user;
};

/**
 * Generate password reset token
 */
const generateResetPasswordToken = async (user) => {
  const minutes = config.settings.minutes_to_password_reset_token_expire;
  const reset_token = crypto.randomBytes(32).toString("hex");
  const expires_at = new Date(new Date().getTime() + minutes * 60000);

  await PasswordReset.create({
    user_id: user.user_id,
    reset_token,
    expires_at,
  });

  return reset_token;
};

/**
 * Handles password changes for users who have requested a reset.
 */
const changePassword = async (tokenInfo, password, password_confirmation) => {
  validateChangePassword(password, password_confirmation);

  const password_hash = await encryptPassword(password);

  await User.update(
    { password_hash },
    {
      where: {
        user_id: tokenInfo.user_id,
      },
    }
  );
};

/**
 * Checks the password reset token.
 */
const verifyChangePasswordToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new CustomError("token_not_provided", 400);
  }

  const token = authHeader.split(" ")[1];

  const passwordResetInfo = await PasswordReset.findOne({
    where: {
      reset_token: token,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });
  if (!passwordResetInfo) {
    throw new CustomError("token_expired");
  }

  return passwordResetInfo;
};

/**
 * Delete an account.
 */
const deleteAccount = async (user_id) => {
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    throw new CustomError("user_not_found", 400);
  }

  await user.destroy();
};

const logout = async (user_id) => {
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    throw new CustomError("user_not_found", 400);
  }

  await revokeTokens(user_id);
};

const update = async (user_id, username, email, password, password_confirmation) => {
  const user = await User.findOne({ where: { user_id } });
  if (!user) {
    throw new CustomError("user_not_found", 400);
  }

  var updateData = {};
  if (username && username !== user.username) {
    updateData.username = username;
  }

  if (email && email !== user.email) {
    updateData.email = email;
  }

  if (password && !validator.isEmpty(password.trim())) {
    updateData.password = password;
    updateData.password_confirmation = password_confirmation;
    updateData.password_hash = await encryptPassword(password);
  }

  if (Object.keys(updateData).length === 0) {
    throw new CustomError("update_no_changes", 400);
  }

  validateUpdate(updateData);

  if (updateData.email) {
    await checkIfEmailAlreadyRegistered(updateData.email, user.user_id);
  }

  await User.update(updateData, {
    where: {
      user_id: user.user_id,
    },
  });

  return await User.findOne({ where: { user_id: user.user_id } });
};

module.exports = {
  signup,
  login,
  requestNewPassword,
  verifyChangePasswordToken,
  changePassword,
  deleteAccount,
  logout,
  update,
};
