const express = require("express");
const router = express.Router();
const i18n = require("../config/i18n");
const authMiddleware = require("../middlewares/authMiddleware");
const budgetService = require("../services/budgetService");

router.post("/save", authMiddleware, async (req, res) => {
  try {
    const response = await budgetService.post("/save", req.body, {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: req.headers["authorization"],
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

router.get("/list/:date", authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;

    const response = await budgetService.get(`/list/${date}`, {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: req.headers["authorization"],
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

router.delete("/delete/:date/:category_id", authMiddleware, async (req, res) => {
  try {
    const { date, category_id } = req.params;

    const response = await budgetService.delete(`/delete/${date}/${category_id}`, {
      headers: {
        "Accept-Language": i18n.getLocale(),
        Authorization: req.headers["authorization"],
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

module.exports = router;
