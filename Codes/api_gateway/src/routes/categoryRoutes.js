const express = require("express");
const router = express.Router();
const i18n = require("../config/i18n");
const authMiddleware = require("../middlewares/authMiddleware");
const categoryService = require("../services/categoryService");

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const response = await categoryService.post("/create", req.body, {
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

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const response = await categoryService.get("/list", {
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

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await categoryService.delete(`/delete/${id}`, {
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
    const response = await categoryService.put(`/update/${id}`, req.body, {
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
