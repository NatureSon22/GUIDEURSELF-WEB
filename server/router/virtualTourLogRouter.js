import express from 'express';
import VirtualTourLog from '../models/VirtualTourLog.js'; // Adjust the import path accordingly
import verifyToken from "../middleware/verifyToken.js"

const router = express.Router();
//router.use(verifyToken)

router.post('/', async (req, res) => {
  try {
    const { campus_name, updated_by, activity } = req.body;

    if (!campus_name || !updated_by || !activity) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const newLog = new VirtualTourLog({ campus_name, updated_by, activity });
    const savedLog = await newLog.save();

    res.status(201).json({ success: true, data: savedLog });
  } catch (error) {
    console.error("Error creating log:", error); 
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const logs = await VirtualTourLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;