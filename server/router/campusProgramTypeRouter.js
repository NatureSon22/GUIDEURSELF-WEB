import express from "express";
import CampusProgramType from "../models/CampusProgramType.js";
import verifyToken from "../middleware/verifyToken.js";
import CampusProgramName from "../models/CampusProgramName.js";

const campusProgramTypeRouter = express.Router();
//campusProgramTypeRouter.use(verifyToken);

// Get all program types
campusProgramTypeRouter.get("/", async (req, res) => {
  try {
    const programTypes = await CampusProgramType.find();
    res.status(200).json(programTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

campusProgramTypeRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { program_type_name: newTypeName } = req.body;

    // Find the old program type name
    const oldType = await CampusProgramType.findById(id);
    if (!oldType) {
      return res.status(404).json({ message: "Program type not found" });
    }
    const oldTypeName = oldType.program_type_name;

    // Update the program type name in CampusProgramType
    const updatedProgramType = await CampusProgramType.findByIdAndUpdate(
      id,
      { program_type_name: newTypeName },
      { new: true } // This ensures the updated document is returned
    );

    // Update all related program names in CampusProgramName
    await CampusProgramName.updateMany(
      { programtype: oldTypeName },
      { programtype: newTypeName }
    );

    res.status(200).json(updatedProgramType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


campusProgramTypeRouter.get("/:id", async (req, res) => {
  try {
    const programType = await CampusProgramType.findById(req.params.id);
    
    if (!programType) {
      return res.status(404).json({ message: "Program type not found" });
    }
    
    res.status(200).json(programType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

campusProgramTypeRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await CampusProgramType.findByIdAndDelete(id);

    if (!deletedType) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.json({ message: "Position deleted successfully", deletedType });
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).json({ message: "Error deleting position" });
  }
});

campusProgramTypeRouter.post("/", async (req, res) => {
  try {
    const {  program_type_name, date_added } = req.body;
    const newType = new CampusProgramType({
      program_type_name,
      date_added,
    });
    const savedType = await newType.save();
    res.status(201).json(savedType); 
  } catch (error) {
    console.error("Error creating administrative position:", error);
    res.status(500).json({ message: "Error creating administrative position" });
  }
});

export default campusProgramTypeRouter;
