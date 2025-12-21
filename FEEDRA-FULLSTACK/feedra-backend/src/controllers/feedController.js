const { createFeedService } = require("../services/feedService");

const createFeed = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Feed content is required",
      });
    }

    const feed = await createFeedService({
      content,
      userId: user.uid,
      userEmail: user.email,
      role: user.role,
    });

    return res.status(201).json({
      message: "Feed created successfully",
      feed,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create feed",
    });
  }
};

module.exports = {
  createFeed,
};
