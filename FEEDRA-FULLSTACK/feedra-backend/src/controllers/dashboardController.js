const {
  fetchDashboardSummary,
  fetchRecentFeeds,
} = require("../services/dashboardService");

const getDashboardSummary = async (req, res) => {
  const data = await fetchDashboardSummary(req.user);
  res.json(data);
};

const getRecentFeeds = async (req, res) => {
  const feeds = await fetchRecentFeeds(5);
  res.json(feeds);
};

module.exports = {
  getDashboardSummary,
  getRecentFeeds,
};
