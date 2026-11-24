import express from "express";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

import logger from "./utils/logger.js";

const app = express();

app.use(
  pinoHttp({
    logger,
    genReqId: () => randomUUID(),

    customLogLevel: (req, res, error) => {
      if (error || res.statusCode >= 500) {
        return "error";
      }
      if (res.statusCode >= 400) {
        return "warn";
      }
      return "info";
    },

    redact: ["req.headers.authorization", "req.headers.cookie"],
  }),
);

export default app;
