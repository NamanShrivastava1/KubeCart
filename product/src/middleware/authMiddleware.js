import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { config } from "../config/config.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token has been revoked. Please log in again.",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

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

export const authenticateSeller = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "Forbidden: Sellers only",
      });
    }

    next();
  });
};
