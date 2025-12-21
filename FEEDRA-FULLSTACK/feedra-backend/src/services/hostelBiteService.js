const { db } = require("../config/firebase");

/**
 * CREATE HostelBite post
 * Status starts as "available"
 */
const createHostelBiteService = async (data, user) => {
  const ref = db.collection("hostelbite").doc();

  const payload = {
    id: ref.id,
    foodType: data.foodType,
    quantity: data.quantity,
    location: data.location,
    status: "available",
    createdBy: user.uid,
    createdAt: new Date(),
  };

  await ref.set(payload);
  return payload;
};

/**
 * LIST HostelBite posts by status with limit (pagination)
 */
const listHostelBiteService = async (status, limit = 10) => {
  const snap = await db
    .collection("hostelbite")
    .where("status", "==", status)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => d.data());
};

/**
 * ASSIGN HostelBite (only if currently available)
 */
const assignHostelBiteService = async (id, user) => {
  const ref = db.collection("hostelbite").doc(id);
  const docSnap = await ref.get();

  if (!docSnap.exists) {
    throw new Error("HostelBite post not found");
  }

  const data = docSnap.data();

  if (data.status !== "available") {
    throw new Error("HostelBite already assigned or completed");
  }

  await ref.update({
    status: "assigned",
    assignedTo: user.uid,
    assignedAt: new Date(),
  });

  return {
    id,
    status: "assigned",
    assignedTo: user.uid,
  };
};

module.exports = {
  createHostelBiteService,
  listHostelBiteService,
  assignHostelBiteService,
};
