// pages/api/sos.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, phone, location, timestamp } = req.body;

    console.log("🚨 SOS Alert Received:", { name, phone, location, timestamp });

    // For now, just return success (later you can integrate SMS, email, DB etc.)
    return res.status(200).json({
      status: "success",
      message: "SOS Alert Sent Successfully",
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
