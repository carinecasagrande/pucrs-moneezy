require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3002,
  system: {
    name: process.env.SYSTEM_NAME || "Moneezy",
    default_locale: process.env.SYSTEM_DEFAULT_LOCALE || "pt",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "user_service_db",
    dialect: process.env.DB_DIALECT || "mysql",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "mugIgKeq8gFyStd",
  },
  nodemailer: {
    service: process.env.NODEMAILER_SERVICE || "hotmail",
    user: process.env.NODEMAILER_AUTH_USER || "",
    password: process.env.NODEMAILER_AUTH_PASSWORD || "",
  },
  endpoint: {
    clientInterface:
      process.env.ENDPOINT_CLIENT_INTERFACE || "http://localhost:3000/",
  },
  settings: {
    minutes_to_password_reset_token_expire:
      parseInt(process.env.SETTINGS_MINUTES_TO_PASSWORD_RESET_TOKEN_EXPIRE) || 10,
  },
};
