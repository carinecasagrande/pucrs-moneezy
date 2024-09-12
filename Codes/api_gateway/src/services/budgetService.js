const axios = require("axios");
const config = require("../config/config");

const budgetService = axios.create({
  baseURL: config.endpoint.budgetService,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = budgetService;
