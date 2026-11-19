import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/user.controller.js";
import * as authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware.authenticateUser, getUserProfile);
router.get("/logout", authMiddleware.authenticateUser, logoutUser);

export default router;
