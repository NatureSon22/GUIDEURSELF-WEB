import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "../config/db.js";
import authRouter from "../router/authRouter.js";
import userRouter from "../router/userRouter.js";
import cookieParser from "cookie-parser";

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

(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
