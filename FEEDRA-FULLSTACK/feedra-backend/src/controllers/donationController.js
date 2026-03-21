const {
  createDonationService,
  listDonationsService,
  claimDonationService,
} = require("../services/donationService");

const createDonation = async (req, res) => {
  try {
    const donation = await createDonationService(req.body, req.user);
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listDonations = async (req, res) => {
  try {
    const donations = await listDonationsService();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const claimDonation = async (req, res) => {
  try {
    const donation = await claimDonationService(req.params.id, req.user);
    res.json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createDonation,
  listDonations,
  claimDonation,
};
