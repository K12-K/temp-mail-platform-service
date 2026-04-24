// services/redis.js
import Redis from "ioredis";

// const redis = new Redis(process.env.REDIS_URL);
const redis = new Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    port: process.env.REDIS_PORT,
});

export default redis;