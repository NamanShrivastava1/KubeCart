import { createClient } from "redis";
import { config } from "./config";

const client = createClient({
  url: config.REDIS_URL,
});

client.on("connect", () => {
  console.log("Connected to Redis successfully");
});

client.on("error", (error) => {
  console.log("Redis connection error", error);
});

await client.connect();
