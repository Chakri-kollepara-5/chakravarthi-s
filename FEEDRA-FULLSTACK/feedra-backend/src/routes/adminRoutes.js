const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getAllDonations,
  verifyUser,
} = require("../controllers/adminController");

const router = express.Router();

// Admin only routes
router.get("/users", authMiddleware, getAllUsers);
router.get("/donations", authMiddleware, getAllDonations);
router.patch("/users/:id/verify", authMiddleware, verifyUser);

module.exports = router;
