import CampusProgramName from "../models/CampusProgramName.js";
import CampusMajor from "../models/CampusMajor.js";

// Service function to update a program name
export const updateProgramName = async (id, newProgramName) => {
  // Find the old program name
  const oldProgram = await CampusProgramName.findById(id);
  if (!oldProgram) {
    throw new Error("Program name not found");
  }
  const oldProgramName = oldProgram.programname;

  // Update the program name in CampusProgramName
  const updatedProgramName = await CampusProgramName.findByIdAndUpdate(
    id,
    { programname: newProgramName },
    { new: true } // This ensures the updated document is returned
  );

  // Update all related majors in CampusMajor
  await CampusMajor.updateMany(
    { programname: oldProgramName },
    { programname: newProgramName }
  );

  return updatedProgramName;
};