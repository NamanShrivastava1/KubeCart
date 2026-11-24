import pino from "pino";
import path from "node:path";
import fs from "node:fs";

const serviceName = "product-service";

const isProduction = process.env.NODE_ENV === "production";

const targets = [
  {
    target: "pino/file",
    level: "info",
    options: {
      destination: 1,
    },
  },
];

if (!isProduction) {
  const logDirectory = path.resolve("logs");

  fs.mkdirSync(logDirectory, {
    recursive: true,
  });

  targets.push(
    {
      target: "pino/file",
      level: "info",
      options: {
        destination: path.join(logDirectory, "combined.log"),
        mkdir: true,
      },
    },
    {
      target: "pino/file",
      level: "error",
      options: {
        destination: path.join(logDirectory, "error.log"),
        mkdir: true,
      },
    },
  );
}

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",

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
