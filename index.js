import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import messageRouter from "./routes/message.route.js";
import userRouter from "./routes/user.route.js";
import timelineRouter from "./routes/timeline.route.js";
import softwareApplicationRouter from "./routes/softwareApplication.route.js";
import skillRouter from "./routes/skill.route.js";
import projectRouter from "./routes/project.route.js";


// create instance of express
const app = express();
// const _dirname = path.resolve();

// configuration
dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local testing
      process.env.PORTFOLIO_URL,
      process.env.DASHBOARD_URL,
    ],
    methods: ["GET", "DELETE", "PUT", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);

// connect to the database
connectDb();


// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));
