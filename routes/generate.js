// routes/generate.js
import express from "express";
import redis from "../services/redis.js";
import { generateEmail } from "../utils/generateEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const email = generateEmail();

  // store metadata (optional but recommended)
  await redis.set(
    `inbox_meta:${email}`,
    JSON.stringify({
      createdAt: Date.now(),
    }),
    "EX",
    600 // 10 min expiry
  );

  res.json({ email });
});

export default router;