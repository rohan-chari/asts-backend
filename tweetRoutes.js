const express = require("express");
const router = express.Router();
const db = require("./dbConnection");

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    // Fetch parent tweets (those without a parent_id)
    db.query(
      "SELECT * FROM tweets WHERE parent_id IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, parentTweets) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (parentTweets.length === 0) {
          return res.status(404).json({ error: "No tweets found" });
        }

        const parentIds = parentTweets.map((tweet) => tweet.tweet_id);

        if (parentIds.length === 0) {
          return res.json({ page, tweets: parentTweets });
        }

        // Fix: Convert parentIds array into a comma-separated string for MySQL IN clause
        const parentIdsString = parentIds.join(",");

        // Fetch child tweets (replies to the parent tweets)
        db.query(
          `SELECT * FROM tweets WHERE parent_id IN (${parentIdsString}) ORDER BY created_at ASC`,
          (err, childTweets) => {
            if (err) {
              console.error("Database query error:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            // Fix: Convert parent_id and tweet_id to BigInt before comparison (if needed)
            const tweetsWithChildren = parentTweets.map((parent) => ({
              ...parent,
              replies: childTweets.filter(
                (child) => BigInt(child.parent_id) === BigInt(parent.tweet_id)
              ),
            }));

            res.json({ page, tweets: tweetsWithChildren });
          }
        );
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
