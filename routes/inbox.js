// routes/inbox.js
import express from "express";
import redis from "../services/redis.js";

const router = express.Router();

// Get inbox
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  const messages = await redis.lrange(`inbox:${email}`, 0, -1);

  const parsed = messages.map(m => JSON.parse(m));

  res.json(parsed);
});

export default router;