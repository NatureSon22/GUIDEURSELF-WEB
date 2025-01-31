import express from 'express';
import VirtualTourLog from '../models/VirtualTourLog.js'; // Adjust the import path accordingly
import verifyToken from "../middleware/verifyToken.js"

const router = express.Router();

router.use(verifyToken)

// Create a new VirtualTourLog entry
router.post('/', async (req, res) => {
  try {
    const { campus_name, updated_by, activity } = req.body;

    // Validate required fields
    if (!campus_name || !updated_by || !activity) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Create and save the log
    const newLog = new VirtualTourLog({ campus_name, updated_by, activity });
    const savedLog = await newLog.save();

    // Return the saved log
    res.status(201).json({ success: true, data: savedLog });
  } catch (error) {
    console.error("Error creating log:", error); // Log the error for debugging
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all VirtualTourLog entries
router.get('/', async (req, res) => {
  try {
    const logs = await VirtualTourLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific VirtualTourLog entry by ID
router.get('/:id', async (req, res) => {
  try {
    const log = await VirtualTourLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a VirtualTourLog entry by ID
router.put('/:id', async (req, res) => {
  try {
    const { campus_name, updated_by, activity } = req.body;
    const updatedLog = await VirtualTourLog.findByIdAndUpdate(
      req.params.id,
      { campus_name, updated_by, activity, date_added: Date.now() },
      { new: true }
    );
    if (!updatedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a VirtualTourLog entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedLog = await VirtualTourLog.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;