import express from "express";
import {
  addProject,
  deleteProject,
  getAllProjects,
  updateProject,
  getSingleProject,
} from "../controllers/project.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/add", isAuthenticated, addProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);
router.get("/getall", getAllProjects);
router.put("/update/:id", isAuthenticated, updateProject);
router.get("/get/:id", getSingleProject);
export default router;
