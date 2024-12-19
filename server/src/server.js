import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "../config/db.js";
import authRouter from "../router/authRouter.js";
import accountRouter from "../router/accountRouter.js";
import cookieParser from "cookie-parser";
import campusRouter from "../router/campusRouter.js";
import roleTypesRouter from "../router/roleTypesRouter.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/campus", campusRouter);
app.use("/api/role-types", roleTypesRouter);

(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
