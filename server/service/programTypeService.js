import CampusProgramType from "@/models/CampusProgramType";
import CampusProgramName from "@/models/CampusProgramName";

export const updateType = async (id, newTypeName) => {
  const oldType = await CampusProgramType.findById(id);
  const oldTypeName = oldType.program_type_name;

  await CampusProgramType.findByIdAndUpdate(id, { program_type_name: newTypeName });

  await CampusProgramName.updateMany(
    { programtype: oldTypeName },
    { programtype: newTypeName }
  );
};