import express from "express";
import CampusProgramName from "../models/CampusProgramName.js";
import verifyToken from "../middleware/verifyToken.js";
import CampusMajor from "../models/CampusMajor.js"; 

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
    const { id } = req.params;
    const { programname: newProgramName, programtype: newProgramType } = req.body;

    // Find the old program details
    const oldProgram = await CampusProgramName.findById(id);
    if (!oldProgram) {
      return res.status(404).json({ message: "Program not found" });
    }

    const oldProgramName = oldProgram.programname;
    const oldProgramType = oldProgram.programtype;

    // Update the program in CampusProgramName
    const updatedProgram = await CampusProgramName.findByIdAndUpdate(
      id,
      { programname: newProgramName, programtype: newProgramType },
      { new: true }
    );

    // Update all related records in CampusMajor if the program name changed
    if (oldProgramName !== newProgramName) {
      await CampusMajor.updateMany(
        { programname: oldProgramName },
        { programname: newProgramName }
      );
    }

    // Optionally, if CampusMajor also stores programtype and it needs updating:
    if (oldProgramType !== newProgramType) {
      await CampusMajor.updateMany(
        { programtype: oldProgramType },
        { programtype: newProgramType }
      );
    }

    res.status(200).json(updatedProgram);
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
