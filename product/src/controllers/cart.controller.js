import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Valid productId and quantity are required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: {
          userId,
          items: [],
        },
      });
    }

    const productIds = cart.items.map((item) => item.productId);

    const products = await productModel.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const items = cart.items.map((item) => ({
      product: productMap.get(item.productId.toString()) || null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart: {
        userId: cart.userId,
        items,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      message: "Cart quantity updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update cart error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.productId.toString() === productId,
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
