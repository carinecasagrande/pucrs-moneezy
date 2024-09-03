const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.post("/signup", userController.actionSignup);
router.post("/login", userController.actionLogin);
router.post("/requestNewPassword", userController.actionRequestNewPassword);
router.patch("/changePassword", userController.actionChangePassword);

// Private routes
router.delete("/delete", authMiddleware, userController.actionDelete);
router.post("/logout", authMiddleware, userController.actionLogout);
router.put("/update", authMiddleware, userController.actionUpdate);

module.exports = router;
