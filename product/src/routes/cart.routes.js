import express from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/add", addToCart);

router.get("/", getCart);

router.put("/update/:productId", updateCartItem);

router.delete("/remove/:productId", removeFromCart);

router.delete("/clear", clearCart);

export default router;
