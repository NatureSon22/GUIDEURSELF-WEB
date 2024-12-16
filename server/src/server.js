import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "../config/db.js";

const app = express();

app.use(json());
app.use(cors());

(async () => {
  config();
  app.listen(process.env.PORT || 3000, async () => {
    await connectDB();
    console.log("Server running on port 3000");
  });
})();
