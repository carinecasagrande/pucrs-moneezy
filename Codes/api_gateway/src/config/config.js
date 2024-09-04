require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV,
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
  },
  system: {
    default_locale: process.env.SYSTEM_DEFAULT_LOCALE,
  },
};
