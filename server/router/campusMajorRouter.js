import express from "express";
import CampusMajor from "../models/CampusMajor.js";
import verifyToken from "../middleware/verifyToken.js";

const campusMajorRouter = express.Router();

campusMajorRouter.use(verifyToken);

// Get all majors
// Get all program names
campusMajorRouter.get("/", async (req, res) => {
  try {
    const { programname } = req.query;
    
    // If programtype exists, filter by it
    const majorNames = programname
      ? await CampusMajor.find({ programname })
      : await CampusMajor.find(); // No filter, get all

    res.status(200).json(majorNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get majors by program name
campusMajorRouter.get("/:programname", async (req, res) => {
  try {
    const majors = await CampusMajor.find({
      programname: req.params.programname,
    });
    res.status(200).json(majors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new major
campusMajorRouter.post("/", async (req, res) => {
  const { _id, programname, majorname } = req.body;

  try {
    const newMajor = new CampusMajor({
      _id,
      programname,
      majorname,
    });
    await newMajor.save();
    res.status(201).json(newMajor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

campusMajorRouter.put("/:id", async (req, res) => {
  try {
    const updatedMajor = await CampusMajor.findByIdAndUpdate(
      req.params.id,
      req.body, // Data to update
      { new: true } // This ensures the updated document is returned
    );

    if (!updatedMajor) {
      return res.status(404).json({ message: "Major not found" });
    }

    res.status(200).json(updatedMajor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

campusMajorRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMajor = await CampusMajor.findByIdAndDelete(id);

    if (!deletedMajor) {
      return res.status(404).json({ message: "Major not found" });
    }

    res.json({ message: "Major deleted successfully", deletedMajor });
  } catch (error) {
    console.error("Error deleting major:", error);
    res.status(500).json({ message: "Error deleting major" });
  }
});

export default campusMajorRouter;
