const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createHostelBite,
  listHostelBite,
  assignHostelBite,
} = require("../controllers/hostelBiteController");

const router = express.Router();

router.post("/", authMiddleware, createHostelBite);
router.get("/", authMiddleware, listHostelBite);
router.patch("/:id/assign", authMiddleware, assignHostelBite);

module.exports = router;