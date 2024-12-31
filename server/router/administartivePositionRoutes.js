import express from 'express';
import AdministartivePosition from '../models/AdministartivePosition.js';
import verifyToken from "../middleware/verifyToken.js"

const router = express.Router();

router.use(verifyToken)

// POST route to add a new administrative position
router.post('/administartiveposition', async (req, res) => {
  try {
    const { administartive_position_name, date_added } = req.body;
    const newPosition = new AdministartivePosition({
      administartive_position_name,
      date_added,
    });
    const savedPosition = await newPosition.save();
    res.status(201).json(savedPosition); // Respond with created resource
  } catch (error) {
    console.error('Error creating administrative position:', error);
    res.status(500).json({ message: 'Error creating administrative position' });
  }
});

// GET route to fetch all administrative positions
router.get('/administartiveposition', async (req, res) => {
  try {
    const positions = await AdministartivePosition.find();
    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: 'Error fetching positions' });
  }
});

export default router;
