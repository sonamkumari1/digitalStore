import express from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  createCheckoutSessionForCart,
  getAllPurchasedProjects,
  getProjectDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/projectPurchaseController.js";

const router = express.Router();

router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);
router.post("/checkout/create-checkout-session-cart", isAuthenticated, createCheckoutSessionForCart)
router.get("/webhook", isAuthenticated, stripeWebhook);
router.get("/project/:projectId/detail-with-status", isAuthenticated, getProjectDetailWithPurchaseStatus);
router.put("/", isAuthenticated, getAllPurchasedProjects);

export default router;
