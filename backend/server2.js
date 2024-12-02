const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

// Serve static files from the directory where your HTML is located
app.use(express.static(path.join(__dirname)));
mongoose.connect("mongodb://localhost:27017/authDB", {});
// Route to serve checking.html
app.get("/checking", (req, res) => {
  res.sendFile(path.join(__dirname, "checking.html"));
});

app.post("/feedback", (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ message: "Feedback is required" });
  }

  // Here you would typically save to a database
  console.log("Received feedback:", feedback);

  res.status(200).json({ message: "Feedback received" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
