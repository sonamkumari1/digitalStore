import e from "express";
import Cart from "../model/cartModel.js";
import Project from "../model/projectModel.js";

export const addToCart = async (req, res) => {
  try {
    const { projectId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.project.toString() === projectId
    );

    if (existingItemIndex >= 0) {
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({
        project: projectId,
        quantity,
        price: project.price,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate(
      "cartItems.project"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({}).populate("cartItems.project");
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching carts", error });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { projectId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.cartItems.find(
      (item) => item.project.toString() === projectId
    );

    if (!item) {
      return res.status(404).json({ message: "Project not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.project.toString() !== projectId
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing project from cart", error });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
