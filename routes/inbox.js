// routes/inbox.js
import express from "express";
import redis from "../services/redis.js";

const router = express.Router();

// Get inbox
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  // const messages = await redis.lrange(`inbox:${email}`, 0, -1);

  // get all message IDs
  const ids = await redis.lrange(`inbox:${email}`, 0, -1);

  if (!ids.length) return res.json([]);

  // fetch all messages in parallel
  const pipeline = redis.pipeline();

  ids.forEach(id => {
    pipeline.hgetall(`message:${id}`);
  });

  const messages = await pipeline.exec();

  const parsed = messages.map(m => JSON.parse(m));

  res.json(parsed);
});

router.put("/:email/read/:id", async (req, res) => {
  const { email, id } = req.params;

  // const key = `inbox:${email}`;
  // const messages = await redis.lrange(key, 0, -1);

  // let updated = false;

  // const newMessages = messages.map(m => {
  //   const msg = JSON.parse(m);

  //   if (msg.id === id) {
  //     msg.isRead = true;
  //     updated = true;
  //   }

  //   return JSON.stringify(msg);
  // });

  // if (!updated) {
  //   return res.status(404).json({ error: "Message not found" });
  // }

  // // Replace full list
  // await redis.del(key);
  // if (newMessages.length) {
  //   await redis.rpush(key, ...newMessages);
  // }

  const key = `message:${id}`;

  const exists = await redis.exists(key);
  if (!exists) {
    return res.status(404).json({ error: "Message not found" });
  }

  await redis.hset(key, "isRead", true);

  res.json({ success: true });
});

router.delete("/:email/:id", async (req, res) => {
  const { email, id } = req.params;

  // const key = `inbox:${email}`;
  // const messages = await redis.lrange(key, 0, -1);

  // let found = false;

  // const filtered = messages.filter(m => {
  //   const msg = JSON.parse(m);
  //   if (msg.id === id) {
  //     found = true;
  //     return false;
  //   }
  //   return true;
  // });

  // if (!found) {
  //   return res.status(404).json({ error: "Message not found" });
  // }

  // // Replace list
  // await redis.del(key);
  // if (filtered.length) {
  //   await redis.rpush(key, ...filtered);
  // }

  const inboxKey = `inbox:${email}`;
  const messageKey = `message:${id}`;

  // remove from list
  await redis.lrem(inboxKey, 0, id);

  // delete message
  await redis.del(messageKey);

  res.json({ success: true });
});

export default router;