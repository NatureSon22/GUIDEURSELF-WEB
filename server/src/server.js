import express from "express";
import cors from "cors";
import { config } from "dotenv";
import "../config/cloudinary.js";
import connectDB from "../config/db.js";
import authRouter from "../router/authRouter.js";
import accountRouter from "../router/accountRouter.js";
import cookieParser from "cookie-parser";
import administrativePositionRoutes from '../router/administartivePositionRouter.js';
import keyOfficialRoutes from "../router/keyOfficialRouter.js";
import campusRouter from "../router/campusRouter.js";
import campusProgramTypeRouter from "../router/campusProgramTypeRouter.js";
import roleTypesRouter from "../router/roleTypesRouter.js";
import universityManagementRouter from "../router/universityManagementRouter.js";
import generalSettingsRouter from "../router/generalSettingRouter.js";

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
app.use("/api/role-types", roleTypesRouter);
app.use("/api/accounts", accountRouter);
app.use("/api", campusRouter);
app.use('/api', administrativePositionRoutes);
app.use("/api", keyOfficialRoutes);
app.use("/api", campusProgramTypeRouter);
app.use("/api", universityManagementRouter);
app.use("/api", generalSettingsRouter);


(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
