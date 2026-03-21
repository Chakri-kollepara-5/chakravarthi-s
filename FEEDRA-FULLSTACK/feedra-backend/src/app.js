const express = require("express");
const app = express();

app.use(express.json());


// ROUTES
const donationRoutes = require("./routes/donationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
// const adminRoutes = require("./routes/adminRoutes");

app.use("/api/donations", donationRoutes);
app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/admin", adminRoutes);

module.exports = app;
