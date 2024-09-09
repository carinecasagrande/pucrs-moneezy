const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

// Private routes
router.post("/create", authMiddleware, categoryController.actionCreate);
router.get("/list", authMiddleware, categoryController.actionList);
router.put("/update/:id", authMiddleware, categoryController.actionUpdate);
router.delete("/delete/:id", authMiddleware, categoryController.actionDelete);
router.delete(
  "/deleteAllFromUser",
  authMiddleware,
  categoryController.actionDeleteAllFromUser
);

module.exports = router;
