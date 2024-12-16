import mongoose from "mongoose";
import { config } from "dotenv";

async function connectDB() {
  try {
    config();

    await mongoose.connect(
      process.env.MONGODB_URI,
    );

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }

  // Close connection on app termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Database connection closed due to app termination");
    process.exit(0);
  });
}

export default connectDB;
