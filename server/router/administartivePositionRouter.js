import express from "express";
import AdministartivePosition from "../models/AdministartivePosition.js";
import {KeyOfficial} from "../models/KeyOfficial.js"; // Import the KeyOfficial model
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

//router.use(verifyToken);

// POST route to add a new administrative position
router.post("/", async (req, res) => {
  try {
    const { position_name, date_added } = req.body;
    const newPosition = new AdministartivePosition({
      position_name,
      date_added,
    });
    const savedPosition = await newPosition.save();
    res.status(201).json(savedPosition); // Respond with created resource
  } catch (error) {
    console.error("Error creating administrative position:", error);
    res.status(500).json({ message: "Error creating administrative position" });
  }
});

// GET route to fetch all administrative positions
router.get("/", async (req, res) => {
  try {
    const positions = await AdministartivePosition.find();
    res.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Error fetching positions" });
  }
});

// DELETE route to remove an administrative position by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPosition = await AdministartivePosition.findByIdAndDelete(id);

    if (!deletedPosition) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.json({ message: "Position deleted successfully", deletedPosition });
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).json({ message: "Error deleting position" });
  }
});

// PUT route to update an administrative position by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { position_name } = req.body;

    // Find the old position name
    const oldPosition = await AdministartivePosition.findById(id);
    if (!oldPosition) {
      return res.status(404).json({ message: "Position not found" });
    }
    const oldPositionName = oldPosition.position_name;

    // Update the position name in AdministartivePosition
    const updatedPosition = await AdministartivePosition.findByIdAndUpdate(
      id,
      { position_name },
      { new: true } // Return the updated document
    );

    if (!updatedPosition) {
      return res.status(404).json({ message: "Position not found" });
    }

    // Update all related KeyOfficial documents
    await KeyOfficial.updateMany(
      { position_name: oldPositionName }, // Find documents with the old position name
      { position_name: position_name }   // Update to the new position name
    );

    res.json({ 
      message: "Position updated successfully", 
      updatedPosition 
    });
  } catch (error) {
    console.error("Error updating position:", error);
    res.status(500).json({ message: "Error updating position" });
  }
});

export default router;