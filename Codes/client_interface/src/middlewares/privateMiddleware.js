const { CustomErrorMessage } = require("../errors/customError");
const errorHandler = require("./errorHandler");
const { validateJwtToken } = require("../services/userService");

const privateMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.moneezy_token;
    if (!token) {
      return res.redirect("/");
    }

    req.user = await validateJwtToken(token);

    next();
  } catch (err) {
    res.cookie("moneezy_token", "");
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
