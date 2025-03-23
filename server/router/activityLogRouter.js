import express from "express";
import ActivityLog from "../models/activityLog.js"; 
import verifyToken from "../middleware/verifyToken.js";
import { Campus } from "../models/campusModel.js"; 

const activityLogRouter = express.Router();

activityLogRouter.get("/", verifyToken, async (req, res) => {
  const { recent } = req.query;
  const { isMultiCampus, campusId } = req.user;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ error: "Campus not found." });
    }

    const filter = isMultiCampus ? {} : { campus_name: campus.campus_name };

    // Ensure the field name matches the database schema (e.g., `date_created` or `createdAt`)
    let query = ActivityLog.find(filter).sort({ date_created: -1 }); // Sort by `date_created` in descending order

    if (recent) {
      const limit = parseInt(recent, 10);
      query = query.limit(limit);
    }

    const activityLogs = await query.exec();
    console.log(activityLogs); // Verify the order of logs before sending the response
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default activityLogRouter;
