const i18n = require("i18n");
const { CustomError } = require("../errors/customError");

/**
 * Handles error output.
 */
function errorHandler(err, req, res, next, message = "default_error") {
  var code = 500;

  if (err instanceof CustomError) {
    code = err.statusCode;
    message = err.message;
  }

  res.status(code).json({
    code: code,
    message: i18n.__(message),
    result: "error",
  });
}

module.exports = errorHandler;
