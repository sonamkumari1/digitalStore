import express from "express";
import { addToCart, getCart, removeCartItem, clearCart, updateCart, getAllCarts } from "../controllers/cartController.js";
import {
    isAuthenticated,
   
  } from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.post("/add",  isAuthenticated, addToCart);
router.get("/",  isAuthenticated, getCart);
router.get("/all",  isAuthenticated, getAllCarts);
router.put("/update",  isAuthenticated, updateCart);
router.delete("/remove/:projectId",  isAuthenticated, removeCartItem);
router.delete("/clear",  isAuthenticated, clearCart);

export default router;