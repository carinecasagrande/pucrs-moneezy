const express = require("express");
const router = express.Router();
const i18n = require("../config/i18n");
const authMiddleware = require("../middlewares/authMiddleware");
const transactionService = require("../services/transactionService");

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const response = await transactionService.post("/create", req.body, {
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
    const date = req.params.date;
    const response = await transactionService.get(`/list/${date}`, {
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

router.delete("/delete/:date/:id", authMiddleware, async (req, res) => {
  try {
    const date = req.params.date;
    const id = req.params.id;
    const response = await transactionService.delete(`/delete/${date}/${id}`, {
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

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await transactionService.put(`/update/${id}`, req.body, {
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
