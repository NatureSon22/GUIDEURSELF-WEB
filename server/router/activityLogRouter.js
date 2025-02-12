import express from 'express';
import ActivityLog from '../models/activityLog.js'; // Adjust the path accordingly

const activityLogRouter = express.Router();

// Create a new activity log
activityLogRouter.post('/', async (req, res) => {
  try {
    const activityLog = new ActivityLog(req.body);
    await activityLog.save();
    res.status(201).send(activityLog);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all activity logs
activityLogRouter.get('/', async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find({});
    res.status(200).send(activityLogs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific activity log by ID
activityLogRouter.get('/:id', async (req, res) => {
  try {
    const activityLog = await ActivityLog.findById(req.params.id);
    if (!activityLog) {
      return res.status(404).send();
    }
    res.status(200).send(activityLog);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an activity log by ID
activityLogRouter.patch('/:id', async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!activityLog) {
      return res.status(404).send();
    }
    res.status(200).send(activityLog);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an activity log by ID
activityLogRouter.delete('/:id', async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByIdAndDelete(req.params.id);
    if (!activityLog) {
      return res.status(404).send();
    }
    res.status(200).send(activityLog);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default activityLogRouter;