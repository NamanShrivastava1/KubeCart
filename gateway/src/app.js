import express from "express";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

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
      if (error || res.statusCode >= 500) {
        return "error";
      }
      if (res.statusCode >= 400) {
        return "warn";
      }
      return "info";
    },

    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.x-api-key",
    ],
  }),
);

export default app;
