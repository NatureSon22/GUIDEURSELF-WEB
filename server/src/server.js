import express from "express";
import cors from "cors";
import mongoose from 'mongoose';  
import { config } from "dotenv";
import connectDB from "../config/db.js";
import authRouter from "../router/authRouter.js";
import accountRouter from "../router/accountRouter.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import administrativePositionRoutes from '../router/administartivePositionRoutes.js';
import keyOfficialRoutes from "../router/keyOfficialRoutes.js";
import campusRouter from "../router/campusRouter.js";
import campusProgramTypeRouter from "../router/campusProgramTypeRouter.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use('/api', administrativePositionRoutes);
app.use("/api", keyOfficialRoutes);
app.use("/api", campusProgramTypeRouter);
app.use("/api", campusRouter);

(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
