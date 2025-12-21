const { db } = require("../config/firebase");

const createFeedService = async ({ content, userId, userEmail, role }) => {
  const feedRef = db.collection("feeds").doc();

  const feedData = {
    id: feedRef.id,
    content,
    userId,
    userEmail,
    role,
    createdAt: new Date(),
  };

  await feedRef.set(feedData);

  return feedData;
};

module.exports = {
  createFeedService,
};
