import { Skill } from "../models/skill.model.js";
import { v2 as cloudinary } from "cloudinary";
export const addSkill = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "SVG is required",
        success: false,
      });
    }
    const { svg } = req.files;
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "SKILLS" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "unknown error"
      );
    }

    const { title, proficiency } = req.body;
    if (!title || !proficiency) {
      res.status(400).json({
        message: "All fields are required",
      });
    }
    const skill = await Skill.create({
      title,
      proficiency,
      svg: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(201).json({
      message: "Skill added successfully",
      success: true,
      skill,
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

export const getAllSkill = async (req, res) => {
  try {
    const skills = await Skill.find();
    if (skills.length < 1) {
      return res.status(400).json({
        message: "No Skills available ",
      });
    }
    res.status(200).json({
      success: true,
      skills,
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

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(400).json({
        message: "Skill not found.",
      });
    }
    const svgPublicID = skill.svg?.public_id;
    await cloudinary.uploader.destroy(svgPublicID);
    await skill.deleteOne();
    res.status(200).json({
      message: "Skill deleted successfully.",
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

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(400).json({
        message: "Skill not found.",
      });
    }
    const { proficiency } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { proficiency },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
      message: "skill updated!",
      skill: updatedSkill,
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
