const { verifyAccessToken } = require("../services/authService");
const { CustomError } = require("../errors/customError");
const i18n = require("../config/i18n");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new CustomError("token_not_provided", 400);
    }

    const token = authHeader.split(" ")[1];
    await verifyAccessToken(token);
    next();
  } catch (error) {
    var code = 500;
    var message = "default_error";

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

module.exports = authMiddleware;
