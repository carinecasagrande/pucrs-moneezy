const i18n = require("i18n");
const path = require("path");
const config = require("./config");

i18n.configure({
  locales: ["en", "pt"],
  directory: path.join(__dirname, "../locales"),
  defaultLocale: config.system.default_locale,
  autoReload: true,
  updateFiles: true,
  syncFiles: true,
  objectNotation: true,
});

module.exports = i18n;
