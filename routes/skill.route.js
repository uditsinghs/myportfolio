import express from "express";
import {
  addSkill,
  deleteSkill,
  getAllSkill,
  updateSkill,
} from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/add", isAuthenticated, addSkill);
router.delete("/delete/:id", isAuthenticated, deleteSkill);
router.get("/getall", getAllSkill);
router.put("/update/:id", isAuthenticated, updateSkill);
export default router;
