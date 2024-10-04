const i18n = require("../config/i18n");
const axios = require("axios");
const config = require("../config/config");
const { getFirstDaysOfMonths } = require("../helpers/utils");

const getBudgetList = async (token) => {
  var dateList = getFirstDaysOfMonths();

  var output = {};
  for (var i in dateList) {
    const result = await axios.get(
      `${config.endpoint.api_gateway}/api/budget/list/${dateList[i]}`,
      {
        headers: {
          "Accept-Language": i18n.getLocale(),
          Authorization: `Bearer ${token}`,
        },
      }
    );
    output[dateList[i]] = result.data.budget_list;
  }

  return output;
};

module.exports = {
  getBudgetList,
};
