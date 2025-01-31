import { updateType } from "@/services/programTypeService";

export const updateProgramType = async (req, res) => {
  const { id } = req.params;
  const { newTypeName } = req.body;

  try {
    await updateType(id, newTypeName);
    res.status(200).json({ message: "Program type updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};