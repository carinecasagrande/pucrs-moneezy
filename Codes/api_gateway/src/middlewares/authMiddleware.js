const { verifyAccessToken } = require("../services/authService");
const { CustomError } = require("../errors/customError");
const errorHandler = require("./errorHandler");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new CustomError("token_not_provided", 400);
    }

    const token = authHeader.split(" ")[1];
    req.user = await verifyAccessToken(token);

    next();
  } catch (err) {
    errorHandler(err, req, res, next);
  }
};

module.exports = authMiddleware;
