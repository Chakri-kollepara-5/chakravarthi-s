// const express = require("express");
// const router = express.Router();

// const {
//   createDonation,
//   listDonations,
//   claimDonation,
// } = require("../controllers/donationController");

// const authMiddleware = require("../middlewares/authMiddleware");

// // PUBLIC – list donations
// router.get("/", listDonations);

// // PROTECTED – create donation
// router.post("/", authMiddleware, createDonation);

// // PROTECTED – claim donation
// router.patch("/:id/claim", authMiddleware, claimDonation);

// module.exports = router;
