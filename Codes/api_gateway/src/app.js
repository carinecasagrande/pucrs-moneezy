const express = require("express");
const i18n = require("./config/i18n");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const config = require("./config/config");
const { CustomError } = require("./errors/customError");

// Settings
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const lang = req.headers["accept-language"];
  if (lang && i18n.getLocales().includes(lang.split(",")[0])) {
    i18n.setLocale(lang.split(",")[0]);
  } else {
    i18n.setLocale(config.system.default_locale);
  }
  next();
});
app.use(i18n.init);

// Routes and Errors
app.use("/api", routes);

app.use((req, res, next) => {
  throw new CustomError("resource_not_found", 404);
});

app.use(errorHandler);

module.exports = app;
