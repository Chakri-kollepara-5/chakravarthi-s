const express = require("express");
const router = express.Router();
const {
  createHostelBite,
  getHostelBites,
  assignHostelBite,
} = require("../controllers/hostelBiteController");

const authMiddleware = require("../middlewares/authMiddleware");

// ✅ PUBLIC READ
router.get("/", getHostelBites);

// 🔒 PROTECTED WRITES
router.post("/", authMiddleware, createHostelBite);
router.patch("/:id/assign", authMiddleware, assignHostelBite);

module.exports = router;
