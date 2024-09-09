const express = require("express");
const router = express.Router();
const i18n = require("../config/i18n");
const userService = require("../services/userService");
const authMiddleware = require("../middlewares/authMiddleware");
const userDeleteMiddleware = require("../middlewares/userDeleteMiddleware");
const { verifyAccessToken } = require("../services/authService");

// Account creation
router.post("/signup", async (req, res) => {
  try {
    const response = await userService.post("/signup", req.body, {
      headers: {
        "Accept-Language": i18n.getLocale(),
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const response = await userService.post("/login", req.body, {
      headers: {
        "Accept-Language": i18n.getLocale(),
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

// Password change request
router.post("/requestNewPassword", async (req, res) => {
  try {
    const response = await userService.post("/requestNewPassword", req.body, {
      headers: {
        "Accept-Language": i18n.getLocale(),
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

// Validates Password Reset Token
router.post("/validatePasswordResetToken", async (req, res) => {
  try {
    const response = await userService.post(
      "/validatePasswordResetToken",
      req.body,
      {
        headers: {
          "Accept-Language": i18n.getLocale(),
          Authorization: req.headers["authorization"],
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json(error.response.data);
  }
});

// Password changes for users who have requested a reset
router.patch("/changePassword", async (req, res) => {
  try {
    const response = await userService.patch("/changePassword", req.body, {
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

// Delete an account
router.delete("/delete", authMiddleware, userDeleteMiddleware, async (req, res) => {
  try {
    const response = await userService.delete("/delete", {
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

// Logs out the user
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const response = await userService.post("/logout", req.body, {
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

// Updates a user's data
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const response = await userService.put("/update", req.body, {
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

router.get("/validateJwtToken", authMiddleware, async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
