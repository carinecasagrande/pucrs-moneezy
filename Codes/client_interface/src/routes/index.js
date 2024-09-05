const express = require("express");
const router = express.Router();
const { getPageConfig } = require("../helpers/page");
const config = require("../config/config");
const i18n = require("../config/i18n");
const resetPasswordMiddleware = require("../middlewares/resetPasswordMiddleware");
const privateMiddleware = require("../middlewares/privateMiddleware");

router.get("/", (req, res) => {
  const token = req.cookies.moneezy_token;
  if (token == undefined || token.trim() == "") {
    const page = getPageConfig();
    page.i18n = {
      email_field: i18n.__("email_field"),
      password_field: i18n.__("password_field"),
      forgot_password: i18n.__("forgot_password"),
      login_button: i18n.__("login_button"),
      register_text: i18n.__("register_text"),
      register_link: i18n.__("register_link"),
      field_required: i18n.__("field_required"),
    };
    page.css.push("/css/public_layout.css");
    page.js.push("/js/login.js");
    page.config.title = `${config.system.name} - ${page.i18n.login_button}`;

    res.render("login", {
      page,
      layout: "../templates/public_layout",
    });
  } else {
    res.redirect("/dashboard");
  }
});

router.get("/signup", (req, res) => {
  const page = getPageConfig();
  page.i18n = {
    username_field: i18n.__("username_field"),
    email_field: i18n.__("email_field"),
    password_field: i18n.__("password_field"),
    signup_button: i18n.__("signup_button"),
    login_text: i18n.__("login_text"),
    login_link: i18n.__("login_link"),
    field_required: i18n.__("field_required"),
  };
  page.css.push("/css/public_layout.css");
  page.js.push("/js/signup.js");
  page.config.title = `${config.system.name} - ${page.i18n.signup_button}`;

  res.render("signup", {
    page,
    layout: "../templates/public_layout",
  });
});

router.get("/request-new-password", (req, res) => {
  const page = getPageConfig();
  page.i18n = {
    forgot_password: i18n.__("forgot_password"),
    forgot_password_desc: i18n.__("forgot_password_desc"),
    email_field: i18n.__("email_field"),
    send_field: i18n.__("send_field"),
    cancel_text: i18n.__("cancel_text"),
    field_required: i18n.__("field_required"),
  };
  page.css.push("/css/public_layout.css");
  page.js.push("/js/request_new_password.js");
  page.config.title = `${config.system.name} - ${page.i18n.forgot_password}`;

  res.render("request_new_password", {
    page,
    layout: "../templates/public_layout",
  });
});

router.get("/reset-password", resetPasswordMiddleware, (req, res) => {
  const page = getPageConfig();
  page.i18n = {
    password_field: i18n.__("password_field"),
    password_confirmation_field: i18n.__("password_confirmation_field"),
    save_button: i18n.__("save_button"),
    reset_password: i18n.__("reset_password"),
    field_required: i18n.__("field_required"),
    password_confirmation_diff: i18n.__("password_confirmation_diff"),
  };
  page.css.push("/css/public_layout.css");
  page.js.push("/js/reset_password.js");
  page.config.title = `${config.system.name} - ${page.i18n.reset_password}`;

  res.render("reset_password", {
    page,
    token: req.query.token,
    layout: "../templates/public_layout",
  });
});

router.get("/dashboard", privateMiddleware, (req, res) => {
  const page = getPageConfig(req.user);
  res.render("dashboard", {
    page,
    layout: "../templates/private_layout",
  });
});

module.exports = router;
