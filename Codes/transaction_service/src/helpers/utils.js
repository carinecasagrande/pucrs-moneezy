const moment = require("moment");

function getLastDayOfMonth(yearMonth) {
  return moment(yearMonth, "YYYY-MM").endOf("month").format("YYYY-MM-DD");
}

function parseDate(date) {
  return new Date(date + " 12:00:00");
}

module.exports = {
  getLastDayOfMonth,
  parseDate,
};
