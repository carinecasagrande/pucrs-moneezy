require("dotenv").config();

module.exports = {
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
  hostname: {
    api_gateway: process.env.HOSTNAME_API_GATEWAY,
  },
};
