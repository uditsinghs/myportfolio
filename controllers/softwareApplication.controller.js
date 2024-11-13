import { SoftwareApplication } from "../models/softwareApplication.model.js";
import { v2 as cloudinary } from "cloudinary";
export const addSoftwareApplication = async (req, res) => {
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
      { folder: "APPLICATIONS_IMAGE" }
    );
    // ("response from cloudinary:", cloudinaryResponseForAvatar);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "unknown error"
      );
    }

    const { name } = req.body;
    if (!name) {
      res.status(400).json({
        message: "  Name is required",
      });
    }
    const application = await SoftwareApplication.create({
      name,
      svg: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(201).json({
      message: "Application added successfully",
      success: true,
      application,
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

export const getAllSoftwareApplication = async (req, res) => {
  try {
    const applications = await SoftwareApplication.find();
    if (applications.length < 1) {
      return res.status(400).json({
        message: "No applications available ",
      });
    }
    res.status(200).json({
      success: true,
      applications,
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

export const deleteSoftwareApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await SoftwareApplication.findById(id);
    if (!application) {
      return res.status(400).json({
        message: "Application not found.",
      });
    }
    const svgPublicID = application.svg?.public_id;
    await cloudinary.uploader.destroy(svgPublicID);
    await application.deleteOne();
    res.status(200).json({
      message: "Application deleted successfully.",
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
