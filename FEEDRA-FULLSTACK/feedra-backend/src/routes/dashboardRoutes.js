const express = require("express");
const router = express.Router();

const {
  createDonation,
  listDonations,
  claimDonation,
} = require("../controllers/donationController");

const authMiddleware = require("../middlewares/authMiddleware");

// ✅ PUBLIC READ
router.get("/", listDonations);

// 🔒 PROTECTED WRITE
router.post("/", authMiddleware, createDonation);
router.patch("/:id/claim", authMiddleware, claimDonation);

module.exports = router;
