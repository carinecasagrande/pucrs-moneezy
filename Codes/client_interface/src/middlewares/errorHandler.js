const i18n = require("i18n");
const { CustomError, CustomErrorMessage } = require("../errors/customError");
const { getPageConfig } = require("../helpers/page");
const config = require("../config/config");

/**
 * Handles error output.
 */
function errorHandler(err, req, res, next, message = "default_error") {
  var code = 500;
  message = i18n.__(message);

  if (err instanceof CustomError) {
    code = err.statusCode;
    message = i18n.__(err.message);
  } else if (err instanceof CustomErrorMessage) {
    code = err.statusCode;
    message = err.message;
  }

  if (req.xhr) {
    res.status(code).json({
      code,
      message,
      result: "error",
    });
  } else {
    const page = getPageConfig();
    page.css.push("/css/public_layout.css");
    page.css.push("/css/error.css");
    page.config.title = `${config.system.name} - Ops!`;

    res.render("page_error", {
      code,
      message,
      page,
      layout: "../templates/public_layout",
    });
  }
}

module.exports = errorHandler;
