import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "../config/db.js";
import authRouter from "../router/authRouter.js";
import userRouter from "../router/userRouter.js";

const app = express();

app.use(json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
