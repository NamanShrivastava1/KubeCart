import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import { HttpStatusCode } from "../constants/HttpStatusCode.js";

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      sellerId: req.user.id,
    });

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const filter = {
      isActive: true,
      stock: { $gt: 0 },
    };

    if (category) {
      filter.category = category;
    }

    if (search?.trim()) {
      filter.$text = {
        $search: search.trim(),
      };
    }

    const [products, totalProducts] = await Promise.all([
      productModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      productModel.countDocuments(filter),
    ]);

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Products fetched successfully",
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts,
        limit: pageSize,
      },
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findOne({
      _id: id,
      isActive: true,
      stock: { $gt: 0 },
    });

    if (!product) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get product error:", error.message);

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Get Seller's Products
const getMyProducts = async (req, res) => {
  try {
    const products = await productModel.find({
      sellerId: req.user.id,
    });

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Your products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get seller products error:", error.message);

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid product ID",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "images",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "No valid fields provided for update",
      });
    }

    const product = await productModel.findOneAndUpdate(
      {
        _id: id,
        sellerId: req.user.id,
      },
      {
        $set: updates,
      },
      {
        returnDocument: "after",
      },
    );

    if (!product) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Product not found or you are not its owner",
      });
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid product data",
      });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findOneAndDelete({
      _id: id,
      sellerId: req.user.id,
    });

    if (!product) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Product not found or you are not its owner",
      });
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
};
