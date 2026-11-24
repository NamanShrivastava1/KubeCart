import { createClient } from "redis";
import { config } from "./config.js";
import logger from "../utils/logger.js";

const client = createClient({
  url: config.REDIS_URL,
});

client.on("connect", () => {
  logger.info("Connected to Redis");
});

client.on("error", (error) => {
  logger.error({ err: error }, "Redis connection error");
});

await client.connect();

export default client;
