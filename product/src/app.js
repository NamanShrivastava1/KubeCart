import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";

import client from "./config/redis.js";
import productRoutes from "./routes/product.routes.js";
import logger from "./utils/logger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Product Service is running");
});

app.use("/", productRoutes);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || randomUUID(),

    customLogLevel: (req, res, error) => {
      if (error || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";

      return "info";
    },
  }),
);

// const response = await client.ping();

export default app;
