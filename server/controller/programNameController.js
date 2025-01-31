import { updateProgramName } from "../services/programNameService.js";

// Controller function to handle updating a program name
export const updateProgramNameController = async (req, res) => {
  try {
    const { id } = req.params;
    const { programname: newProgramName } = req.body;

    // Call the service function to update the program name
    const updatedProgramName = await updateProgramName(id, newProgramName);

    res.status(200).json(updatedProgramName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};