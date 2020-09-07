const express = require("express");
const router = express.Router();

router.get("/welcome", async (req, res) => {
  res.status(200).json({ message: "Welcome, Nathan" });
});

module.exports = router;