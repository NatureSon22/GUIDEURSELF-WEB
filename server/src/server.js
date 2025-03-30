import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io";
import http from "http";
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
import keyOfficialLogRouter from "../router/keyOfficialLogRouter.js";
import campusLogRouter from "../router/campusLogRouter.js";
import conversationRouter from "../router/conversationRouter.js";
import messageRouter from "../router/messageRouter.js";
import activityLogRouter from "../router/activityLogRouter.js";
import feedbackRouter from "../router/feedbackRouter.js";
import trendRouter from "../router/trendRouter.js";
import sessionRouter from "../router/sessionRouter.js";
import messagechatRouter from "../router/messagechatRouter.js";
import MessageChatModel from "../models/messagechat.js";
import fs from "fs";
import uploadToUploadcare from "../config/uploadCare.js";
import path from "path";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://guide-urself.netlify.app", "http://localhost:5173", "*"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"],
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
const io = new Server(server, {
  cors: {
    origin: ["https://guide-urself.netlify.app", "http://localhost:5173", "*"],
  },
  methods: ["GET", "POST"],
  credentials: true,
});

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
app.use("/api/keyofficiallogs", keyOfficialLogRouter);
app.use("/api/campuslogs", campusLogRouter);
app.use("/api/activitylogs", activityLogRouter);
app.use("/api/feedbacks", feedbackRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/trend", trendRouter);
app.use("/api/session", sessionRouter);
app.use("/api/chats", messagechatRouter);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined room.`);
    }
  });

  socket.on(
    "sendMessage",
    async ({ sender_id, receiver_id, content, files }) => {
      try {
        let fileUrls = [];

        if (files && files.length > 0) {
          if (!fs.existsSync("uploads")) {
            fs.mkdirSync("uploads", { recursive: true });
          }

          for (const file of files) {
            const { data, name } = file;
            const ext = path.extname(name);
            const fileName = `${Date.now()}${ext}`;
            const filePath = path.join("uploads", fileName);

            try {
              // Validate Base64
              if (!data.startsWith("data:")) {
                console.error("Invalid Base64 data");
                continue;
              }

              // Convert Base64 to Buffer
              const base64Data = data.replace(/^data:.+;base64,/, "");
              const buffer = Buffer.from(base64Data, "base64");

              // Write file
              await fs.promises.writeFile(filePath, buffer);
              console.log(`File saved: ${filePath}`);

              // Upload to Uploadcare
              const fileUrl = await uploadToUploadcare(filePath);
              fileUrls.push({
                url: fileUrl.cdnUrl,
                type: ["png", "jpg", "jpeg"].includes(ext.replace(".", ""))
                  ? "img"
                  : "file",
              });

              // Delete file
              await fs.promises.unlink(filePath);
              console.log(`File deleted: ${filePath}`);
            } catch (error) {
              console.error("Error processing file:", error);
            }
          }
        }

        console.log("File URLs:", fileUrls);

        // Save message with file URLs
        const newMessage = new MessageChatModel({
          sender_id,
          receiver_id,
          content: content || "",
          files: fileUrls, // Now correctly formatted as { url, type }
          status: "sent",
        });

        await newMessage.save();

        // ✅ Emit only if users are connected
        if (io.sockets.adapter.rooms.has(sender_id)) {
          io.to(sender_id).emit("receiveMessage", newMessage);
        }
        if (io.sockets.adapter.rooms.has(receiver_id)) {
          io.to(receiver_id).emit("receiveMessage", newMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  );

  socket.on("markAsRead", async ({ sender_id, receiver_id }) => {
    await MessageChatModel.updateMany(
      { sender_id, receiver_id, status: "sent" },
      { $set: { status: "read" } }
    );

    io.to(sender_id).emit("messagesRead", { sender_id, receiver_id });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

(async () => {
  config();
  server.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port", process.env.PORT || 3000);
  });
})();
