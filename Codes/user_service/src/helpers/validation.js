const validator = require("validator");
const { CustomError } = require("../errors/customError");
const { User } = require("../models");
const { Op } = require("sequelize");

/**
 * Validate user registration data.
 */
const validateSignup = (username, email, password) => {
  if (!username || validator.isEmpty(username.trim())) {
    throw new CustomError("username_required", 400);
  }

  if (!email || validator.isEmpty(email.trim())) {
    throw new CustomError("email_required", 400);
  }

  if (!validator.isEmail(email)) {
    throw new CustomError("email_invalid", 400);
  }

  if (!password || validator.isEmpty(password.trim())) {
    throw new CustomError("password_required", 400);
  }
};

/**
 * Check if the email is already in use
 */
const checkIfEmailAlreadyRegistered = async (email, user_id = null) => {
  var filter = {
    email,
  };

  if (user_id) {
    filter.user_id = {
      [Op.ne]: user_id,
    };
  }

  const existingUser = await User.findOne({ where: filter });
  if (existingUser) {
    throw new CustomError("email_already_registered", 400);
  }
};

/**
 * Validate user login data.
 */
const validateLogin = (email, password) => {
  if (!email || validator.isEmpty(email.trim())) {
    throw new CustomError("email_required", 400);
  }

  if (!validator.isEmail(email)) {
    throw new CustomError("email_invalid", 400);
  }

  if (!password || validator.isEmpty(password.trim())) {
    throw new CustomError("password_required", 400);
  }
};

/**
 * Validate password change request data.
 */
const validateRequestNewPassword = (email) => {
  if (!email || validator.isEmpty(email.trim())) {
    throw new CustomError("email_required", 400);
  }

  if (!validator.isEmail(email)) {
    throw new CustomError("email_invalid", 400);
  }
};

/**
 * Validates password change data for users who have requested a reset.
 */
const validateChangePassword = (password, password_confirmation) => {
  if (!password || validator.isEmpty(password.trim())) {
    throw new CustomError("password_required", 400);
  }

  if (!password_confirmation || validator.isEmpty(password_confirmation.trim())) {
    throw new CustomError("password_confirmation_required", 400);
  }

  if (password !== password_confirmation) {
    throw new CustomError("password_confirmation_diff", 400);
  }
};

/**
 * Validates a user's update data.
 */
const validateUpdate = (updateData) => {
  if (updateData.username && validator.isEmpty(updateData.username.trim())) {
    throw new CustomError("username_required", 400);
  }

  if (updateData.email) {
    if (validator.isEmpty(updateData.email.trim())) {
      throw new CustomError("email_required", 400);
    }

    if (!validator.isEmail(updateData.email)) {
      throw new CustomError("email_invalid", 400);
    }
  }

  if (updateData.password) {
    if (validator.isEmpty(updateData.password.trim())) {
      throw new CustomError("password_required", 400);
    }

    if (
      !updateData.password_confirmation ||
      validator.isEmpty(updateData.password_confirmation.trim())
    ) {
      throw new CustomError("password_confirmation_required", 400);
    }

    if (updateData.password !== updateData.password_confirmation) {
      throw new CustomError("password_confirmation_diff", 400);
    }
  }
};

module.exports = {
  validateSignup,
  checkIfEmailAlreadyRegistered,
  validateLogin,
  validateRequestNewPassword,
  validateChangePassword,
  validateUpdate,
};
