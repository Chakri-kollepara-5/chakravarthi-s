const { db } = require("../config/firebase");

const fetchDashboardSummary = async () => {
  const feedsSnap = await db.collection("feeds").get();
  const hostelSnap = await db
    .collection("hostelbite")
    .where("status", "==", "available")
    .get();

  return {
    totalFeeds: feedsSnap.size,
    activeHostelBite: hostelSnap.size,
  };
};

const fetchRecentFeeds = async (limit) => {
  const snap = await db
    .collection("feeds")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => d.data());
};

module.exports = {
  fetchDashboardSummary,
  fetchRecentFeeds,
};
