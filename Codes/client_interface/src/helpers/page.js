const config = require("../config/config");
const i18n = require("../config/i18n");

const getPageConfig = (user = null) => {
  return {
    css: [
      "/css/reset.css",
      "/node_modules/bootstrap/dist/css/bootstrap.min.css",
      "/node_modules/simple-notify/dist/simple-notify.css",
      "/node_modules/sweetalert2/dist/sweetalert2.min.css",
      "/css/default.css",
    ],
    js: [
      "/node_modules/jquery/dist/jquery.min.js",
      "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
      "/node_modules/simple-notify/dist/simple-notify.min.js",
      "/node_modules/sweetalert2/dist/sweetalert2.min.js",
      "/node_modules/sweetalert2/dist/sweetalert2.min.js",
      "/node_modules/gasparesganga-jquery-loading-overlay/dist/loadingoverlay.min.js",
      "/js/default.js",
    ],
    i18n: {},
    i18n_default: {
      welcome_text: i18n.__("welcome_text"),
      categories: i18n.__("categories"),
      account: i18n.__("account"),
      logout: i18n.__("logout"),
      swal_logout_button: i18n.__("swal_logout_button"),
      swal_logout_text: i18n.__("swal_logout_text"),
      dashboard: i18n.__("dashboard"),
      transactions: i18n.__("transactions"),
      budget: i18n.__("budget"),
      report: i18n.__("report"),
      expenses: i18n.__("expenses"),
      revenues: i18n.__("revenues"),
      category: i18n.__("category"),
      no_results: i18n.__("no_results"),
      success_expression: i18n.__("success_expression"),
      error_expression: i18n.__("error_expression"),
      swal_remove_button: i18n.__("swal_remove_button"),
      cancel_text: i18n.__("cancel_text"),
      save_button: i18n.__("save_button"),
      field_required: i18n.__("field_required"),
    },
    config: {
      locale: i18n.getLocale(),
      title: config.system.name,
      system_name: config.system.name,
      endpoind_api_gateway: config.endpoint.api_gateway,
      user,
    },
  };
};

module.exports = { getPageConfig };
