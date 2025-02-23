const express = require("express");
const router = express.Router();
const db = require("./dbConnection");

// Get all stock prices
router.get("/", (req, res) => {
  db.query("SELECT price FROM stock_prices WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});


module.exports = router;
