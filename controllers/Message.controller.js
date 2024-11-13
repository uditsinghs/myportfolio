import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderName, subject, message } = req.body;
    if (!senderName || !subject || !message) {
      res.status(400).json({
        message: "Please Provide all fields",
      });
    }
    const data = await Message.create({
      senderName,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully.",
      success: true,
      data,
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

export const getAllMessages = async (req, res) => {
  try {
    let allmessages = await Message.find();
    if (allmessages.length < 1) {
      return res.status(400).json({
        message: "No messages available.",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      allmessages,
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
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Message deleted successfully.",
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
