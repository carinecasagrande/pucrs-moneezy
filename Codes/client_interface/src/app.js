const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const i18n = require("./config/i18n");
const routes = require("./routes");
const config = require("./config/config");
const { CustomError } = require("./errors/customError");
const errorHandler = require("./middlewares/errorHandler");

// Settings
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../public/views"));
app.use(express.static(path.join(__dirname, "../public/assets")));

app.use((req, res, next) => {
  const lang = req.cookies.moneezy_lang;
  if (lang && i18n.getLocales().includes(lang.split(",")[0])) {
    i18n.setLocale(lang.split(",")[0]);
  } else {
    i18n.setLocale(config.system.default_locale);
  }
  next();
});
app.use(i18n.init);

// Routes and erros
app.use("/", routes);

app.use((req, res, next) => {
  if (req.xhr) {
    throw new CustomError("resource_not_found", 404);
  } else {
    throw new CustomError("page_not_found", 404);
  }
});

app.use(errorHandler);

module.exports = app;
