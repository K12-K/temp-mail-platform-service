// app.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import generateRoute from "./routes/generate.js";
import inboxRoutes from "./routes/inbox.js";
import webhookRoutes from "./routes/webhook.js";
import { initSocket } from "./sockets/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = initSocket(server);

// attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/generate", generateRoute);
app.use("/api/inbox", inboxRoutes);
app.use("/webhook", webhookRoutes);

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});