const express = require("express");
const cors = require("cors");

const feedRoutes = require("./routes/feedRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const hostelBiteRoutes = require("./routes/hostelBiteRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Feedra backend running" });
});

app.use("/api/feeds", feedRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hostelbite", hostelBiteRoutes);
app.use("/api/admin", adminRoutes);
app.get("/__proof__", (req, res) => {
  res.send("THIS IS THE CORRECT BACKEND");
});


module.exports = app;