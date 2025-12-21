const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDashboardSummary,
  getRecentFeeds,
} = require("../controllers/dashboardController");

console.log("🔥 dashboardRoutes LOADED");

const router = express.Router();

// router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/summary", getDashboardSummary);

router.get("/recent-feeds", authMiddleware, getRecentFeeds);

module.exports = router;