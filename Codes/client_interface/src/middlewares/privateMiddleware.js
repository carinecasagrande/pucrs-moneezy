const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { CustomError, CustomErrorMessage } = require("../errors/customError");
const errorHandler = require("./errorHandler");
const axios = require("axios");

const privateMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.moneezy_token;
    if (!token) {
      throw new CustomError("token_not_provided", 400);
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        throw new CustomError("token_invalid", 401);
      }
      req.user = decoded;
      next();
    });
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

module.exports = privateMiddleware;
