// routes/webhook.js
import express from "express";
import multer from "multer";
import redis from "../services/redis.js";

const router = express.Router();
const upload = multer();

router.post("/mailgun", upload.none(), async (req, res) => {
  // console.log(req)
  // console.log("Headers:", req.headers);
  // console.log("Body:", req.body);
  // console.log("Raw fields:", Object.keys(req.body || {}));
  const body = req.body;

  // Prefer best available fields
  const from = body.from || body.sender;
  const to = body.recipient;
  const subject = body.subject || "(no subject)";

  const html = body["stripped-html"] || body["body-html"] || "";
  const text = body["stripped-text"] || body["body-plain"] || "";

  // Generate preview (first 30 chars clean text)
  const preview = text.replace(/\s+/g, " ").trim().slice(0, 30);
  console.log(body["stripped-html"])

  // const {
  //   recipient,
  //   sender,
  //   subject,
  //   "body-plain": text,
  //   "body-html": html
  // } = req.body;

  const message = {
    from,
    subject,
    text,
    html,
    createdAt: new Date()
  };

  // Save to Redis (TTL 10 min)
  await redis.lpush(`inbox:${recipient}`, JSON.stringify(message));
  await redis.expire(`inbox:${recipient}`, 600);

  // Emit via socket (real-time)
  req.io?.to(recipient).emit("new_email", message);

  res.send("OK");
});

export default router;