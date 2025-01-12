import express from "express";
import CampusProgramName from "../models/CampusProgramName.js";
import verifyToken from "../middleware/verifyToken.js";

const campusProgramNameRouter = express.Router();

campusProgramNameRouter.use(verifyToken);

// Get all program names
campusProgramNameRouter.get("/", async (req, res) => {
  try {
    const { programtype } = req.query;
    
    // If programtype exists, filter by it
    const programNames = programtype
      ? await CampusProgramName.find({ programtype })
      : await CampusProgramName.find(); // No filter, get all

    res.status(200).json(programNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get program names by program type
campusProgramNameRouter.get("/:programtype", async (req, res) => {
  try {
    const programNames = await CampusProgramName.find({
      programtype: req.params.programtype,
    });
    res.status(200).json(programNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new program name
campusProgramNameRouter.post("/", async (req, res) => {
  const {  programtype, programname } = req.body;

  try {
    const newProgramName = new CampusProgramName({
      programtype,
      programname,
    });
    await newProgramName.save();
    res.status(201).json(newProgramName);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

campusProgramNameRouter.put("/:id", async (req, res) => {
  try {
    const updatedProgramName = await CampusProgramName.findByIdAndUpdate(
      req.params.id,
      req.body, // Data to update
      { new: true } // This ensures the updated document is returned
    );

    if (!updatedProgramName) {
      return res.status(404).json({ message: "Program type not found" });
    }

    res.status(200).json(updatedProgramName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

campusProgramNameRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedName = await CampusProgramName.findByIdAndDelete(id);

    if (!deletedName) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.json({ message: "Position deleted successfully", deletedName });
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).json({ message: "Error deleting position" });
  }
});

export default campusProgramNameRouter;
