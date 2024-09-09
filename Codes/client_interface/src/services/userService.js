const axios = require("axios");
const config = require("../config/config");
const i18n = require("../config/i18n");

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

module.exports = {
  validatePasswordResetToken,
  validateJwtToken,
};
