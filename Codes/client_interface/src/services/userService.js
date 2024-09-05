const axios = require("axios");
const config = require("../config/config");

const validatePasswordResetToken = async (token) => {
  await axios.post(
    `${config.endpoint.api_gateway}/api/user/validatePasswordResetToken`,
    {
      token,
    }
  );
};

module.exports = {
  validatePasswordResetToken,
};
