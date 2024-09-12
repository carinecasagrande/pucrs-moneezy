const { CustomErrorMessage } = require("../errors/customError");
const errorHandler = require("./errorHandler");
const { validateJwtToken, setDefaultCookies } = require("../services/userService");

const privateMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.moneezy_token;
    if (!token) {
      return res.redirect("/");
    }

    req.user = await validateJwtToken(token);

    await setDefaultCookies(req, res);

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

module.exports = privateMiddleware;
