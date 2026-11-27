import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authenticateSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenticated seller routes
router.post("/create", authenticateSeller, createProduct);

router.get("/my-products", authenticateSeller, getMyProducts);

router.patch("/update/:id", authenticateSeller, updateProduct);

router.delete("/delete/:id", authenticateSeller, deleteProduct);

// Public routes
router.get("/get-all", getAllProducts);

router.get("/:id", getProductById);

export default router;
