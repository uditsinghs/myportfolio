import express from "express";
import {
  createTimeline,
  getAllTimelines,
  deleteTimeline,
} from "../controllers/timeline.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/sendtimeline", isAuthenticated, createTimeline);
router.delete("/deletetimeline/:id", isAuthenticated, deleteTimeline);
router.get("/getalltimeline", getAllTimelines);
export default router;
