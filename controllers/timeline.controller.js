import { Timeline } from "../models/timeline.model.js";
export const createTimeline = async (req, res) => {
  try {
    const { title, description, from, to } = req.body;
    const timeline = await Timeline.create({
      title,
      description,
      timeline: { from, to },
    });
    return res.status(201).json({
      success: true,
      message: "Timeline added.!",
      timeline,
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

export const getAllTimelines = async (req, res) => {
  try {
    const allTimelines = await Timeline.find();
    if (allTimelines.length < 1) {
      return res.status(400).json({
        message: "No Timeline ",
      });
    }
    res.status(200).json({
      success: true,
      allTimelines,
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

export const deleteTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const timeline = await Timeline.findById(id);
    if (!timeline) {
      return res.status(400).json({
        message: "Timeline not found.",
      });
    }
    await timeline.deleteOne();
    res.status(200).json({
      message: "Timeline deleted successfully.",
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
