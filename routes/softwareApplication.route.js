import express from "express";
import {
  addSoftwareApplication,
  getAllSoftwareApplication,
  deleteSoftwareApplication,
} from "../controllers/softwareApplication.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/add", isAuthenticated, addSoftwareApplication);
router.delete("/delete/:id", isAuthenticated, deleteSoftwareApplication);
router.get("/getall", getAllSoftwareApplication);
export default router;
