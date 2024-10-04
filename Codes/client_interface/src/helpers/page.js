const config = require("../config/config");
const i18n = require("../config/i18n");

const getPageConfig = (user = null) => {
  if (user) {
    const username = user.username.split(" ");
    user.firstname = username[0];
  }

  var i18n_language = "en-US";
  var currency = "USD";
  if (i18n.getLocale() == "pt") {
    i18n_language = "pt-BR";
    currency = "BRL";
  }

  return {
    css: [
      "/css/reset.css",
      "/node_modules/bootstrap/dist/css/bootstrap.min.css",
      "/node_modules/simple-notify/dist/simple-notify.css",
      "/node_modules/sweetalert2/dist/sweetalert2.min.css",
      "/node_modules/@chenfengyuan/datepicker/dist/datepicker.min.css",
      "/css/default.css",
    ],
    js: [
      "/node_modules/jquery/dist/jquery.min.js",
      "/node_modules/@popperjs/core/dist/umd/popper.min.js",
      "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
      "/node_modules/simple-notify/dist/simple-notify.min.js",
      "/node_modules/sweetalert2/dist/sweetalert2.min.js",
      "/node_modules/jquery-mask-plugin/dist/jquery.mask.min.js",
      "/node_modules/@chenfengyuan/datepicker/dist/datepicker.min.js",
      `/node_modules/@chenfengyuan/datepicker/i18n/datepicker.${i18n_language}.js`,
      "/node_modules/gasparesganga-jquery-loading-overlay/dist/loadingoverlay.min.js",
      "/js/default.js",
    ],
    i18n: {
      welcome_text: i18n.__("welcome_text"),
      categories: i18n.__("categories"),
      account: i18n.__("account"),
      logout: i18n.__("logout"),
      swal_logout_button: i18n.__("swal_logout_button"),
      swal_logout_text: i18n.__("swal_logout_text"),
      dashboard: i18n.__("dashboard"),
      quick_action: i18n.__("quick_action"),
      transactions: i18n.__("transactions"),
      transaction: i18n.__("transaction"),
      description: i18n.__("description"),
      budget: i18n.__("budget"),
      budgeted: i18n.__("budgeted"),
      report: i18n.__("report"),
      expenses: i18n.__("expenses"),
      balance: i18n.__("balance"),
      no: i18n.__("no"),
      yes: i18n.__("yes"),
      accounts_payable: i18n.__("accounts_payable"),
      biggest_expenses: i18n.__("biggest_expenses"),
      accounts_receivable: i18n.__("accounts_receivable"),
      expense_status: i18n.__("expense_status"),
      search: i18n.__("search"),
      value: i18n.__("value"),
      revenues: i18n.__("revenues"),
      category: i18n.__("category"),
      realized: i18n.__("realized"),
      pending: i18n.__("pending"),
      total: i18n.__("total"),
      type: i18n.__("type"),
      date: i18n.__("date"),
      expense_status: i18n.__("expense_status"),
      revenue_status: i18n.__("revenue_status"),
      no_results: i18n.__("no_results"),
      resume: i18n.__("resume"),
      success_expression: i18n.__("success_expression"),
      error_expression: i18n.__("error_expression"),
      remove_button: i18n.__("remove_button"),
      cancel_text: i18n.__("cancel_text"),
      save_button: i18n.__("save_button"),
      others: i18n.__("others"),
      field_required: i18n.__("field_required"),
      string_divider: i18n.__("string_divider"),
      edit_text: i18n.__("edit_text"),
      remove_text: i18n.__("remove_text"),
      email_field: i18n.__("email_field"),
      password_field: i18n.__("password_field"),
      forgot_password: i18n.__("forgot_password"),
      login_button: i18n.__("login_button"),
      register_text: i18n.__("register_text"),
      register_link: i18n.__("register_link"),
      username_field: i18n.__("username_field"),
      signup_button: i18n.__("signup_button"),
      login_text: i18n.__("login_text"),
      login_link: i18n.__("login_link"),
      forgot_password_desc: i18n.__("forgot_password_desc"),
      send_field: i18n.__("send_field"),
      swal_remove_transaction_text: i18n.__("swal_remove_transaction_text"),
      password_confirmation_field: i18n.__("password_confirmation_field"),
      reset_password: i18n.__("reset_password"),
      password_confirmation_diff: i18n.__("password_confirmation_diff"),
      budget_field: i18n.__("budget_field"),
      swal_remove_budget_text: i18n.__("swal_remove_budget_text"),
      swal_remove_category_text: i18n.__("swal_remove_category_text"),
      category_name_field: i18n.__("category_name_field"),
      category_type_field: i18n.__("category_type_field"),
      category_color_field: i18n.__("category_color_field"),
      category_icon_field: i18n.__("category_icon_field"),
      refresh_page: i18n.__("refresh_page"),
      transaction_not_found: i18n.__("transaction_not_found"),
      category_id_missing: i18n.__("category_id_missing"),
      category_not_found: i18n.__("category_not_found"),
      current_password_field: i18n.__("current_password_field"),
      new_password_field: i18n.__("new_password_field"),
      delete_account_button: i18n.__("delete_account_button"),
      swal_delete_account_text: i18n.__("swal_delete_account_text"),
      swal_delete_account_button: i18n.__("swal_delete_account_button"),
      swal_delete_account_confirm_required: i18n.__(
        "swal_delete_account_confirm_required"
      ),
      swal_delete_account_confirm_incorrect: i18n.__(
        "swal_delete_account_confirm_incorrect"
      ),
    },
    config: {
      locale: i18n.getLocale(),
      title: config.system.name,
      system_name: config.system.name,
      endpoind_api_gateway: config.endpoint.api_gateway,
      user,
      i18n_language,
      currency,
    },
  };
};

module.exports = { getPageConfig };
