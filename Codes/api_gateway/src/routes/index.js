const express = require("express");
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");
const budgetRoutes = require("./budgetRoutes");
const transactionRoutes = require("./transactionRoutes");

const router = express.Router();
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/budget", budgetRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
