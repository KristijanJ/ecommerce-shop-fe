import Redis from "ioredis";
import logger from "./logger";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => {
  logger.info({ host: process.env.REDIS_HOST || "localhost" }, "Redis connected");
});

redis.on("error", (err) => {
  logger.error({ err }, "Redis error");
});

export default redis;
