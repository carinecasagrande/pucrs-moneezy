const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

// Private routes
router.post("/create", authMiddleware, transactionController.actionCreate);
router.get("/list/:date", authMiddleware, transactionController.actionList);
router.put("/update/:id", authMiddleware, transactionController.actionUpdate);
router.delete(
  "/delete/:date/:id",
  authMiddleware,
  transactionController.actionDelete
);
router.delete(
  "/deleteAllFromUser",
  authMiddleware,
  transactionController.actionDeleteAllFromUser
);

module.exports = router;
