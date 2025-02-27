import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateSellerProfile,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/all").get(getAllUsers);
// router.route("/:id").get(getUserById);
router.route("/profile").get(isAuthenticated, getUserProfile);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateUserProfile);

  router
  .route("/seller-profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateSellerProfile);


export default router;
