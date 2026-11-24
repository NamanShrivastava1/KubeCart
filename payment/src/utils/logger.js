import "dotenv/config";

import pino from "pino";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const serviceName = "payment-service";
const logLevel = process.env.LOG_LEVEL || "info";
const logToFile =
  process.env.LOG_TO_FILE === "true" || process.env.NODE_ENV !== "production";

const targets = [
  {
    target: "pino/file",
    level: logLevel,
    options: {
      destination: 1,
    },
  },
];

if (logToFile) {
  const logDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../logs",
  );

  fs.mkdirSync(logDirectory, {
    recursive: true,
  });

  targets.push({
    target: "pino/file",
    level: logLevel,
    options: {
      destination: path.join(logDirectory, "combined.log"),
      mkdir: true,
    },
  });
}

const logger = pino(
  {
    level: logLevel,

    base: {
      service: serviceName,
      environment: process.env.NODE_ENV || "development",
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
      paths: [
        "password",
        "token",
        "accessToken",
        "refreshToken",
        "authorization",
        "cookie",
        "req.headers.authorization",
        "req.headers.cookie",
      ],
      censor: "[REDACTED]",
    },
  },
  pino.transport({ targets }),
);

export default logger;
