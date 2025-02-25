import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
  getCompletedProjects,
  projectLiked,
  getLikedProjects,
  removeLikedProject,
  getProjectsByCreator,
} from "../controllers/projectController.js";
import {
  isAuthenticated,
  authorizedRoles,
} from "../middlewares/isAuthenticated.js";

import upload from "../utils/multer.js";

const router = express.Router();

router.route("/").post(
  isAuthenticated,
  authorizedRoles("seller"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createProject
);

router.route("/:id").put(
  isAuthenticated,
  authorizedRoles("seller"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateProject
);

router
  .route("/:id")
  .delete(isAuthenticated, authorizedRoles("seller"), deleteProject);

router.post("/like/:projectId", isAuthenticated, projectLiked);
router.post("/:projectId/unlike", isAuthenticated, removeLikedProject);
router.get("/liked", isAuthenticated, getLikedProjects);
router.route("/").get(getAllProjects);
router.get("/search", searchProjects);
router.get("/completed-projects", getCompletedProjects);
router.get("/:projectId", getProjectById);
router.get("/creator/:creatorId", getProjectsByCreator);



export default router;
