require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  },
  endpoint: {
    userService: process.env.ENDPOINT_USER_SERVICE,
    categoryService: process.env.ENDPOINT_CATEGORY_SERVICE,
    budgetService: process.env.ENDPOINT_BUDGET_SERVICE,
    transactionService: process.env.ENDPOINT_TRANSACION_SERVICE,
  },
  system: {
    default_locale: process.env.SYSTEM_DEFAULT_LOCALE,
  },
};
