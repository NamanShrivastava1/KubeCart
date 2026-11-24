import express from "express";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

import client from "./config/redis.js";
import userRoutes from "./routes/user.routes.js";
import logger from "./utils/logger.js";

const app = express();

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => {
      const requestId = req.headers["x-request-id"];

      const id = typeof requestId === "string" &&
        /^[\w-]{1,128}$/.test(requestId)
        ? requestId
        : randomUUID();

      req.headers["x-request-id"] = id;
      return id;
    },
    customLogLevel: (req, res, error) => {
      if (error || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.x-api-key",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("User Service is running");
});

app.use("/", userRoutes);

// const response = await client.ping();

export default app;
