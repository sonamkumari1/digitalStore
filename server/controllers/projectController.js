import mongoose from "mongoose";
import Project from "../model/projectModel.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";
import User from "../model/userModel.js";
import Cart from "../model/cartModel.js";

export const createProject = async (req, res) => {
  try {
    // ✅ Get authenticated user's ID correctly
    const creatorId = req.user._id;
    if (!creatorId) {
      return res.status(400).json({ message: "Creator not authenticated" });
    }

    // ✅ Ensure both thumbnail and video are provided
    const { thumbnail, video } = req.files;
    if (!thumbnail || !video) {
      return res
        .status(400)
        .json({ message: "Both thumbnail and video are required" });
    }

    let projectThumbnail = null;
    let projectVideo = null;

    if (thumbnail) {
      const uploadedImage = await uploadMedia(thumbnail[0].path);
      projectThumbnail = uploadedImage.secure_url;
    }

    if (video) {
      const uploadedVideo = await uploadMedia(video[0].path, "video");
      projectVideo = uploadedVideo.secure_url;
    }

    // ✅ Check if creator exists and has the correct role
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    if (creator.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can create projects" });
    }

    const { title, description, category, level, price, discountPercentage=0, status } = req.body;

    if (!title || !description || !category || !level || !price || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create a new project
    const project = await Project.create({
      title,
      thumbnail: projectThumbnail,
      description,
      category,
      level,
      video: projectVideo,
      price: Number(price), 
      discountPercentage: Number(discountPercentage), 
      status,
      creator: req.user._id,
    });

    const projects = await Project.find().populate({path:"creator", select:"name email role photoUrl"});
    console.log(projects, "projects");

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error in createProject:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isCompleted: true }).populate(
      "creator",
      "name email role photoUrl"
    );
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getCompletedProjects:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
   const projects = await Project.find().populate("creator", "name email role photoUrl");

    // console.log(projects, "creator id")
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllProjects:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }
    console.log("Received projectId:", projectId);

    const project = await Project.findById(projectId).populate(
      "creator",
      "name email role "
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error in getProjectById:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const creatorId = req.user._id;
    if (!creatorId) {
      return res.status(400).json({ message: "Creator not authenticated" });
    }

    const projectId = req.params.id;
    const { title, description, category, level, price, discountPercentage, status } = req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure only the project creator can update it
    if (project.creator.toString() !== creatorId.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You can only update your own projects",
      });
    }

    let projectThumbnail = project.thumbnail;
    let projectVideo = project.video;

    if (thumbnailFile) {
      if (project.thumbnail) {
        const publicId = project.thumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      const uploadedImage = await uploadMedia(thumbnailFile.path);
      projectThumbnail = uploadedImage.secure_url;
    }

    if (videoFile) {
      if (project.video) {
        const publicId = project.video.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      const uploadedVideo = await uploadMedia(videoFile.path, "video");
      projectVideo = uploadedVideo.secure_url;
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.level = level || project.level;
    project.price = price || project.price;
    project.discountPercentage=discountPercentage || project.discountPercentage
    project.status = status || project.status;
    project.thumbnail = projectThumbnail;
    project.video = projectVideo;

    await project.save();
    console.log(project, "project")
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error in updateProject:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.thumbnail) {
      const publicId = project.thumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    if (project.video) {
      const publicId = project.video.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProject:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchProjects = async (req, res) => {
  try {
    let { query = "", categories = [], sortByPrice = "" } = req.query;

    // Construct search criteria
    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        {category: {$regex:query, $options:"i"}},
      ];
    }

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // Sorting logic
    let sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.price = 1;
    } else if (sortByPrice === "high") {
      sortOptions.price = -1;
    }

    // Fetch projects with filtering, sorting, and populate creator details
    const projects = await Project.find(searchCriteria)
      .populate("creator", "name photoUrl") // Populate creator details
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      projects: projects || [],
    });
  } catch (error) {
    console.error("Error in searchProjects:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const projectLiked=async(req,res)=>{
  try{

    const { projectId }=req.params;
    const userId=req.user._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project=await Project.findById(projectId)
                                                                                                

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const alreadyLiked = project.likes.includes(userId);

    if(alreadyLiked){
      project.likes=project.likes.filter((id)=> id.toString()!== userId.toString)
    }
    else{
      project.likes.push(userId);
    }

    await project.save();
    res.status(200).json({ message: alreadyLiked ? "Project unliked" : "Project liked", likes: project.likes.length });
  }catch(error) {
    console.error("Error in likeProject:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getLikedProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ likes: userId }).populate(
      "creator",
      "name email role photoUrl"
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getLikedProjects:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeLikedProject = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Ensure user data is logged
    console.log("Received request to unlike project:", req.params.projectId);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove user's like
    project.likes = project.likes.filter((id) => id.toString() !== userId.toString());
    await project.save();

    res.status(200).json({ message: "Like removed successfully", likes: project.likes.length });
  } catch (error) {
    console.error("Error in removeLikedProject:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getProjectsByCreator = async (req, res) => {
    try {
        const { creatorId } = req.params;

        if (!creatorId) {
            return res.status(400).json({ message: "Creator ID is required" });
        }

        const projects = await Project.find({ creator: creatorId });

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found for this creator" });
        }

        return res.status(200).json({ success: true, projects });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


