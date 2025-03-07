import express from "express";
import ActivityLog from "../models/activityLog.js"; // Adjust path accordingly
import verifyToken from "../middleware/verifyToken.js";
import { Campus } from "../models/campusModel.js"; // Ensure correct import

const activityLogRouter = express.Router();

// Get all activity logs (or recent ones)
activityLogRouter.get("/", verifyToken, async (req, res) => {
  const { recent } = req.query;
  const { isMultiCampus, campusId } = req.user;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ error: "Campus not found." });
    }

    const filter = isMultiCampus ? {} : { campus_name: campus.campus_name };

    // Build query with optional sorting & limit
    let query = ActivityLog.find(filter).sort({ createdAt: -1 });

    if (recent) {
      const limit = parseInt(recent, 10);
      query = query.limit(limit);
    }

    const activityLogs = await query.exec();

    res.status(200).json(activityLogs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default activityLogRouter;
