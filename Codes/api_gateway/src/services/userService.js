const axios = require("axios");
const config = require("../config/config");

const userService = axios.create({
  baseURL: config.endpoint.userService,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = userService;
