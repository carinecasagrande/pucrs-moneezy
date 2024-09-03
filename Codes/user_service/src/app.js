const express = require("express");
const i18n = require("./config/i18n");
const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/config");

// Settings
const app = express();
app.use(express.json());
app.use(errorHandler);
app.use(i18n.init);
app.use((req, res, next) => {
  const lang = req.headers["accept-language"];
  if (lang && i18n.getLocales().includes(lang.split(",")[0])) {
    i18n.setLocale(lang.split(",")[0]);
  } else {
    i18n.setLocale(config.system.default_locale);
  }
  next();
});

// Routes
app.use("/api/users", userRoutes);

// Synchronizes models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Connected to database and synchronized tables.");
  })
  .catch((error) => {
    console.error("Error connecting to database: ", error);
  });

module.exports = app;
