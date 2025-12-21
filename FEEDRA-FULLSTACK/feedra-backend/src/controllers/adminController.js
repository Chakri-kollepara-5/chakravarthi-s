const { db } = require("../config/firebase");

// 🔐 Helper: admin check
const ensureAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return false;
  }
  return true;
};

// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const snap = await db.collection("users").get();
  const users = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  res.json(users);
};

// ================= GET ALL DONATIONS =================
const getAllDonations = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const snap = await db.collection("donations").get();
  const donations = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  res.json(donations);
};

// ================= VERIFY USER =================
const verifyUser = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const userId = req.params.id;

  await db.collection("users").doc(userId).update({
    verified: true,
  });

  res.json({ message: "User verified successfully" });
};

module.exports = {
  getAllUsers,
  getAllDonations,
  verifyUser,
};
