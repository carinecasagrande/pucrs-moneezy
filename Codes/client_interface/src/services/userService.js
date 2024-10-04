const axios = require("axios");
const config = require("../config/config");
const i18n = require("../config/i18n");
const { getCategoryList } = require("./categoryService");
const { CustomError } = require("../errors/customError");
const { getBudgetList } = require("./budgetService");
const { getTransactionData } = require("./transactionService");

const validatePasswordResetToken = async (token) => {
  await axios.post(
    `${config.endpoint.api_gateway}/api/user/validatePasswordResetToken`,
    {
      token,
    }
  );
};

const validateJwtToken = async (token) => {
  const result = await axios.get(
    `${config.endpoint.api_gateway}/api/user/validateJwtToken`,
    {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return result.data;
};

const setDefaultCookies = async (req, res) => {
  try {
    if (!req.cookies.moneezy_categories) {
      const categoryList = await getCategoryList(req.cookies.moneezy_token);
      res.cookie("moneezy_categories", JSON.stringify(categoryList));
    }

    if (!req.cookies.moneezy_budget) {
      const budgetList = await getBudgetList(req.cookies.moneezy_token);
      res.cookie("moneezy_budget", JSON.stringify(budgetList));
    }

    if (!req.cookies.moneezy_transaction) {
      const transactionData = await getTransactionData(req.cookies.moneezy_token);
      res.cookie("moneezy_transaction", JSON.stringify(transactionData.list));
      res.cookie("moneezy_balance", JSON.stringify(transactionData.balance));
    }
  } catch (error) {
    deleteDefaultCookies(res);
    throw new CustomError("error_to_load_cookies", 500);
  }
};

const deleteDefaultCookies = (res) => {
  res.cookie("moneezy_token", "");
  res.cookie("moneezy_categories", "");
  res.cookie("moneezy_budget", "");
  res.cookie("moneezy_transaction", "");
  res.cookie("moneezy_balance", "");
};

module.exports = {
  validatePasswordResetToken,
  validateJwtToken,
  setDefaultCookies,
  deleteDefaultCookies,
};
