const i18n = require("../config/i18n");
const axios = require("axios");
const config = require("../config/config");

const getCategoryList = async (token) => {
  const result = await axios.get(
    `${config.endpoint.api_gateway}/api/category/list`,
    {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return result.data.category_list;
};

module.exports = {
  getCategoryList,
};
