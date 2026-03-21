const express = require("express");
const cors = require("cors");

const feedRoutes = require("./routes/feedRoutes");

const app = express();

app.use(cors());
app.use(express.json());
pp.get("/", (req, res) => {
  res.status(200).json({
    message: "Feedra backend is running",
  });
});

// Register routes
app.use("/api/feeds", feedRoutes);

module.exports = app;
