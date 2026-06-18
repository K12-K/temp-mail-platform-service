// routes/generate.js
import express from "express";
import redis from "../services/redis.js";
import { generateEmail } from "../utils/generateEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { visitorId, isForced } = req.body;

  let currentEmail = await redis.get(`visitor:${visitorId}`);
  let email = currentEmail;

  if (!currentEmail || isForced) {
    email = generateEmail();

    await redis.set(`visitor:${visitorId}`, email, "EX", 43200); // 10 min = 600 || EXPERIMENTAL PURPOSE 12 hours visitor expiry

    // store metadata (optional but recommended)
    await redis.set(
      `inbox_meta:${email}`,
      JSON.stringify({
        createdAt: Date.now(),
      }),
      "EX",
      600 // 10 min expiry
    );
  }

  res.json({ email });
});

export default router;