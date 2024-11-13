import { Project } from "../models/project.model.js";
import { v2 as cloudinary } from "cloudinary";
export const addProject = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "Project Banner is required",
        success: false,
      });
    }
    const { projectBanner } = req.files;
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PROJECTS_IMAGES" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "unknown error"
      );
    }

    const {
      title,
      description,
      gitRepoLink,
      ProjectLink,
      stack,
      technologies,
      deployed,
    } = req.body;
    if (!title || !description || !stack || !technologies || !deployed) {
      res.status(400).json({
        message: "All fields are required",
      });
    }
    const project = await Project.create({
      title,
      description,
      gitRepoLink,
      ProjectLink,
      stack,
      technologies,
      deployed,
      projectBanner: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(201).json({
      message: "Project added successfully",
      success: true,
      project,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (projects.length < 1) {
      return res.status(400).json({
        message: "No Projects available ",
      });
    }
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(400).json({
        message: "Project not found.",
      });
    }
    const projectBannerPublicID = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectBannerPublicID);
    await project.deleteOne();
    res.status(200).json({
      message: "Project deleted successfully.",
      success: true,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const newProject = {
      title: req.body.title,
      description: req.body.description,
      gitRepoLink: req.body.gitRepoLink,
      ProjectLink: req.body.ProjectLink,
      stack: req.body.stack,
      technologies: req.body.technologies,
      deployed: req.body.deployed,
    };
    // Handling avatar update if provided
    if (req.files && req.files.projectBanner) {
      const projectBanner = req.files.projectBanner;
      const project = await Project.findById(id);
      if (project.projectBanner.public_id) {
        await cloudinary.uploader.destroy(project.projectBanner.public_id);
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        { folder: "PROJECTS_IMAGES" }
      );
      newProject.projectBanner = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    const updatedProject = await Project.findByIdAndUpdate(id, newProject, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProject = await Project.findById(id);
    if (!singleProject) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      singleProject,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};
