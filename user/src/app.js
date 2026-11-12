import express from "express";
import cookieParser from "cookie-parser";
import client from "./config/redis.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("User Service is running");
});

app.use("/", userRoutes);

const response = await client.ping();

export default app;
