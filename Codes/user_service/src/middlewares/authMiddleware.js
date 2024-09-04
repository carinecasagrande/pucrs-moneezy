const { CustomError } = require("../errors/customError");
const i18n = require("i18n");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Authentication Middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new CustomError("token_not_provided", 400);
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        throw new CustomError("token_invalid", 401);
      }
      req.user = decoded;
      next();
    });
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
