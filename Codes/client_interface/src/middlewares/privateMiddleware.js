const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { CustomErrorMessage } = require("../errors/customError");
const errorHandler = require("./errorHandler");

const privateMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.moneezy_token;
    if (!token) {
      res.redirect("/");
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        res.redirect("/");
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
