import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import client from "./config/redis.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Product Service is running");
});

app.use("/", productRoutes);

// const response = await client.ping();

export default app;
