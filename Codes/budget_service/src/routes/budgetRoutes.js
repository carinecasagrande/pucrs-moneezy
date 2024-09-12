const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const authMiddleware = require("../middlewares/authMiddleware");

// Private routes
router.post("/save", authMiddleware, budgetController.actionSave);
router.get("/list/:date", authMiddleware, budgetController.actionList);
router.delete(
  "/delete/:date/:category_id",
  authMiddleware,
  budgetController.actionDelete
);
router.delete(
  "/deleteAllFromUser",
  authMiddleware,
  budgetController.actionDeleteAllFromUser
);

module.exports = router;
