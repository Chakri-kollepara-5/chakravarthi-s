const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createFeed } = require("../controllers/feedController");

// console.log("🔥 feedRoutes.js LOADED")

const router = express.Router();

router.post("/", authMiddleware, createFeed);

module.exports = router;
