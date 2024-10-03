const axios = require("axios");
const config = require("../config/config");

const transactionService = axios.create({
  baseURL: config.endpoint.transactionService,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = transactionService;
