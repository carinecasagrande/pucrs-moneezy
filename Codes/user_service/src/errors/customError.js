/**
 * Extends the built-in Error class to include a status code.
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { CustomError };
