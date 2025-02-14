import express from "express";
import cors from "cors";
import { config } from "dotenv";
import "../config/cloudinary.js";
import connectDB from "../config/db.js";
import authRouter from "../router/authRouter.js";
import accountRouter from "../router/accountRouter.js";
import cookieParser from "cookie-parser";
import administrativePositionRoutes from "../router/administartivePositionRouter.js";
import keyOfficialRoutes from "../router/keyOfficialRouter.js";
import campusRouter from "../router/campusRouter.js";
import campusProgramTypeRouter from "../router/campusProgramTypeRouter.js";
import campusProgramNameRouter from "../router/campusProgramNameRouter.js";
import campusMajorRouter from "../router/campusMajorRouter.js";
import roleTypesRouter from "../router/roleTypesRouter.js";
import universityManagementRouter from "../router/universityManagementRouter.js";
import generalSettingsRouter from "../router/generalSettingRouter.js";
import templateRouter from "../router/templateRouter.js";
import statusRouter from "../router/statusRouter.js";
import documentRouter from "../router/documentRouter.js";
import testChatRouter from "../router/testchatRouter.js";
import virtualTourLogRouter from "../router/virtualTourLogRouter.js";
import conversationRouter from "../router/conversationRouter.js";
import messageRouter from "../router/messageRouter.js";
import activityLogRouter from "../router/activityLogRouter.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://web-guideurself.netlify.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// web
app.use("/api/auth", authRouter);
app.use("/api/messages", testChatRouter);
app.use("/api/documents", documentRouter);
app.use("/api/role-types", roleTypesRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/templates", templateRouter);
app.use("/api/status", statusRouter);
app.use("/api", campusRouter);
app.use("/api/administartiveposition", administrativePositionRoutes);
app.use("/api/keyofficials", keyOfficialRoutes);
app.use("/api/campusprogramtypes", campusProgramTypeRouter);
app.use("/api/campusprogramnames", campusProgramNameRouter);
app.use("/api/campusmajors", campusMajorRouter);
app.use("/api/university", universityManagementRouter);
app.use("/api/general", generalSettingsRouter);
app.use("/api/virtualtourlogs", virtualTourLogRouter);
app.use("/api/activitylogs", activityLogRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
