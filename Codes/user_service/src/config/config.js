require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  system: {
    default_locale: process.env.SYSTEM_DEFAULT_LOCALE,
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  nodemailer: {
    service: process.env.NODEMAILER_SERVICE,
    user: process.env.NODEMAILER_AUTH_USER,
    password: process.env.NODEMAILER_AUTH_PASSWORD,
  },
  settings: {
    minutes_to_password_reset_token_expire: parseInt(
      process.env.SETTINGS_MINUTES_TO_PASSWORD_RESET_TOKEN_EXPIRE
    ),
  },
  endpoint: {
    clientInterface: process.env.ENDPOINT_CLIENT_INTERFACE,
  },
  hostname: {
    api_gateway: process.env.HOSTNAME_API_GATEWAY,
  },
};
