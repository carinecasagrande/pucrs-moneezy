const axios = require("axios");
const config = require("../config/config");

const categoryService = axios.create({
  baseURL: config.endpoint.categoryService,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = categoryService;
