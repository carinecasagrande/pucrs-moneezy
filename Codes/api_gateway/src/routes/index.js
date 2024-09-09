const express = require("express");
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
