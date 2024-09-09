const { CustomError, CustomErrorMessage } = require("../errors/customError");
const { validatePasswordResetToken } = require("../services/userService");
const errorHandler = require("./errorHandler");

const resetPasswordMiddleware = async (req, res, next) => {
  try {
    const token = req.params.token;
    if (!token) {
      throw new CustomError("token_not_provided", 400);
    }

    await validatePasswordResetToken(token);

    next();
  } catch (err) {
    if (err.response && err.response.data) {
      next(
        new CustomErrorMessage(err.response.data.message, err.response.data.code)
      );
    } else {
      errorHandler(err, req, res, next);
    }
  }
};

module.exports = resetPasswordMiddleware;
