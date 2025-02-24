const express = require("express");
const router = express.Router();
const db = require("./dbConnection");

router.get("/", (req, res) => {
  db.query("SELECT price FROM stock_prices WHERE id = 778255", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No stock price found" });
    }

    const price = parseFloat(results[0].price);

    res.json({ price });
  });
});


module.exports = router;
