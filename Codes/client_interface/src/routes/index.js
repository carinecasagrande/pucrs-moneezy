const express = require("express");
const router = express.Router();
const { getPageConfig } = require("../helpers/page");
const config = require("../config/config");
const i18n = require("../config/i18n");
const resetPasswordMiddleware = require("../middlewares/resetPasswordMiddleware");
const privateMiddleware = require("../middlewares/privateMiddleware");
const publicMiddleware = require("../middlewares/publicMiddleware");
const { colorList, iconList } = require("../helpers/utils");

router.get("/", (req, res) => {
  const token = req.cookies.moneezy_token;
  if (token == undefined || token.trim() == "") {
    const page = getPageConfig();
    page.css.push("/css/public_layout.css");
    page.js.push("/js/login.js");
    page.config.title = `${config.system.name} - ${page.i18n.login_button}`;

    res.render("login", {
      page,
      layout: "../templates/public_layout",
    });
  } else {
    return res.redirect("/dashboard");
  }
});

router.get("/signup", publicMiddleware, (req, res) => {
  const page = getPageConfig();
  page.css.push("/css/public_layout.css");
  page.js.push("/js/signup.js");
  page.config.title = `${config.system.name} - ${page.i18n.signup_button}`;

  res.render("signup", {
    page,
    layout: "../templates/public_layout",
  });
});

router.get("/request-new-password", publicMiddleware, (req, res) => {
  const page = getPageConfig();
  page.css.push("/css/public_layout.css");
  page.js.push("/js/request_new_password.js");
  page.config.title = `${config.system.name} - ${page.i18n.forgot_password}`;

  res.render("request_new_password", {
    page,
    layout: "../templates/public_layout",
  });
});

router.get(
  "/reset-password/:token",
  publicMiddleware,
  resetPasswordMiddleware,
  (req, res) => {
    const page = getPageConfig();
    page.css.push("/css/public_layout.css");
    page.js.push("/js/reset_password.js");
    page.config.title = `${config.system.name} - ${page.i18n.reset_password}`;

    res.render("reset_password", {
      page,
      token: req.params.token,
      layout: "../templates/public_layout",
    });
  }
);

router.get("/dashboard", privateMiddleware, (req, res) => {
  const page = getPageConfig(req.user);
  res.render("dashboard", {
    current_page: "dashboard",
    page,
    layout: "../templates/private_layout",
  });
});

router.get("/transactions", privateMiddleware, (req, res) => {
  const page = getPageConfig(req.user);
  page.css.push("/css/transactions.css");
  page.js.push("/js/transactions.js");
  page.config.title = `${config.system.name} - ${page.i18n.transactions}`;

  res.render("transactions", {
    current_page: "transactions",
    page,
    layout: "../templates/private_layout",
  });
});

router.get("/budget", privateMiddleware, async (req, res) => {
  const page = getPageConfig(req.user);
  page.css.push("/css/budget.css");
  page.js.push("/js/budget.js");
  page.config.title = `${config.system.name} - ${page.i18n.budget}`;

  res.render("budget", {
    current_page: "budget",
    page,
    layout: "../templates/private_layout",
  });
});

router.get("/report", privateMiddleware, (req, res) => {
  const page = getPageConfig(req.user);
  res.render("report", {
    current_page: "report",
    page,
    layout: "../templates/private_layout",
  });
});

router.get("/categories", privateMiddleware, async (req, res) => {
  const page = getPageConfig(req.user);
  page.css.push("/css/categories.css");
  page.js.push("/js/categories.js");
  page.config.title = `${config.system.name} - ${page.i18n.categories}`;

  res.render("categories", {
    current_page: "categories",
    page,
    colors: colorList,
    icons: iconList,
    layout: "../templates/private_layout",
  });
});

router.get("/account", privateMiddleware, (req, res) => {
  const page = getPageConfig(req.user);
  page.js.push("/js/account.js");
  page.config.title = `${config.system.name} - ${page.i18n.account}`;

  res.render("account", {
    current_page: "account",
    page,
    layout: "../templates/private_layout",
  });
});

module.exports = router;
