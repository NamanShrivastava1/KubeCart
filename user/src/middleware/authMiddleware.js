import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.token ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        message: "Access Denied.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token has been revoked. Please log in again.",
      });
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(503).json({
      message: "Authentication service temporarily unavailable",
    });
  }
};
