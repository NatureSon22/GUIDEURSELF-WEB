import express from 'express';
import ActivityLog from '../models/activityLog.js'; // Adjust the path accordingly

const activityLogRouter = express.Router();

// Get all activity logs
activityLogRouter.get('/', async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find({});
    res.status(200).send(activityLogs);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default activityLogRouter;