import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { config } from "../config/config.js";
import { HttpStatusCode } from "../constants/HttpStatusCode.js";
import logger from "../utils/logger.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);

    if (isBlacklisted) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
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
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Invalid or expired token",
      });
    }

    logger.error({ err: error }, "Authentication service error");

    return res.status(HttpStatusCode.SERVICE_UNAVAILABLE).json({
      message: "Authentication service temporarily unavailable",
    });
  }
};

export const authenticateSeller = async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user.role !== "seller") {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Forbidden: Sellers only",
      });
    }

    next();
  });
};
