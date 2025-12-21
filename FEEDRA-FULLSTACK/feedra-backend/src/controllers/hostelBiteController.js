const {
  createHostelBiteService,
  listHostelBiteService,
  assignHostelBiteService,
} = require("../services/hostelBiteService");

const createHostelBite = async (req, res) => {
  const post = await createHostelBiteService(req.body, req.user);
  res.status(201).json(post);
};

const listHostelBite = async (req, res) => {
  const { status = "available", limit = 10 } = req.query;
  const posts = await listHostelBiteService(status, Number(limit));
  res.json(posts);
};

const assignHostelBite = async (req, res) => {
  const updated = await assignHostelBiteService(req.params.id, req.user);
  res.json(updated);
};

module.exports = {
  createHostelBite,
  listHostelBite,
  assignHostelBite,
};
