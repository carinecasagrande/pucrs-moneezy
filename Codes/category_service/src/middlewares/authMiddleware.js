const { CustomError } = require("../errors/customError");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const errorHandler = require("./errorHandler");

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
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};

module.exports = authMiddleware;
