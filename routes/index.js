const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome, to the PEVN fullstack api!" });
});

router.get("/welcome", async (req, res) => {
  res.status(200).json({ message: "Welcome, Nathan" });
});

router.get("/db-connection-status", async (req, res) => {
  
  db.connect((err) => {
    if (err) {
      res.send("CONNECTION ERROR: ", err);
    } else {
      res.send("CONNECTED!");
    }
  });
});

module.exports = router;