import { createClient } from "redis";
import { config } from "./config.js";

const client = createClient({
  url: config.REDIS_URL,
});

client.on("connect", () => {
  console.log("Redis connected");
});

// client.on("ready", () => {
//   console.log("Redis is ready to accept commands");
// });

client.on("error", (error) => {
  console.error("Redis connection error:", error);
});

await client.connect();

export default client;
