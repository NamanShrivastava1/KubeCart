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

router.put("/update/:id", authenticateSeller, updateProduct);

router.delete("/delete/:id", authenticateSeller, deleteProduct);

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
