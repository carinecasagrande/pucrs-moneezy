const i18n = require("../config/i18n");
const axios = require("axios");
const config = require("../config/config");
const { getFirstDaysOfMonths } = require("../helpers/utils");

const getTransactionData = async (token) => {
  var dateList = getFirstDaysOfMonths();

  var output = {};
  var balance = 0;
  for (var i in dateList) {
    const result = await axios.get(
      `${config.endpoint.api_gateway}/api/transaction/list/${dateList[i]}`,
      {
        headers: {
          "Accept-Language": i18n.getLocale(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const month = Object.keys(result.data.transaction_list);
    output[month] = result.data.transaction_list[month];
    balance = result.data.balance;
  }

  return {
    list: output,
    balance,
  };
};

module.exports = {
  getTransactionData,
};
