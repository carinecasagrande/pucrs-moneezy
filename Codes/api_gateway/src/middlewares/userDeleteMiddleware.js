const categoryService = require("../services/categoryService");
const i18n = require("../config/i18n");
const budgetService = require("../services/budgetService");

const userDeleteMiddleware = async (req, res, next) => {
  try {
    await categoryService.delete(`/deleteAllFromUser`, {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: req.headers["authorization"],
      },
    });

    await budgetService.delete(`/deleteAllFromUser`, {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: req.headers["authorization"],
      },
    });

    next();
  } catch (err) {
    next();
  }
};

module.exports = userDeleteMiddleware;
