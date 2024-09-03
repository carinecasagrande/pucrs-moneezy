const { CustomError } = require("../errors/customError");
const { verifyAccessToken } = require("../services/authService");

/**
 * Authentication Middleware
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new CustomError("token_not_provided", 400);
  }

  const token = authHeader.split(" ")[1];

  const decoded = await verifyAccessToken(token);
  req.user = decoded;
  next();
};

module.exports = authMiddleware;
