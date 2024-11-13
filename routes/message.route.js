import express from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/Message.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/sendmessage", sendMessage);
router.get("/getmessages", getAllMessages);
router.delete("/deletemessage/:id", isAuthenticated, deleteMessage);

export default router;
