// routes/webhook.js
import express from "express";
import multer from "multer";
import redis from "../services/redis.js";

const router = express.Router();
const upload = multer();

router.post("/mailgun", upload.none(), async (req, res) => {
  console.log(req.body)
  
  const {
    recipient,
    sender,
    subject,
    "body-plain": text,
    "body-html": html
  } = req.body;

  const message = {
    from: sender,
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