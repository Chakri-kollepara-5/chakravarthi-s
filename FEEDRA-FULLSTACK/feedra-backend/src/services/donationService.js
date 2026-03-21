const { db } = require("../config/firebase");

exports.listDonations = async () => {
  const snap = await db
    .collection("donations")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
};

exports.createDonation = async (data, user) => {
  const ref = db.collection("donations").doc();

  const payload = {
    ...data,
    status: "available",
    donorId: user.uid,
    createdAt: new Date(),
  };

  await ref.set(payload);
  return { id: ref.id, ...payload };
};

exports.claimDonation = async (id, user) => {
  const ref = db.collection("donations").doc(id);
  const doc = await ref.get();

  if (!doc.exists) throw new Error("Not found");

  if (doc.data().status !== "available") {
    throw new Error("Already claimed");
  }

  await ref.update({
    status: "claimed",
    claimedBy: user.uid,
    claimedAt: new Date(),
  });

  return { id, status: "claimed" };
};
