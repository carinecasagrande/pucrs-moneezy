require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  system: {
    default_locale: process.env.SYSTEM_DEFAULT_LOCALE,
    name: process.env.SYSTEM_NAME,
  },
  endpoint: {
    api_gateway: process.env.ENDPOINT_API_GATEWAY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
