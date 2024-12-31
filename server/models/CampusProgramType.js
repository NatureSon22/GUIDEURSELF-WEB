import mongoose from "mongoose";

const CampusProgramTypeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  program_type_name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const CampusProgramType = mongoose.model("CampusProgramType", CampusProgramTypeSchema, "campusprogramtype");

export default CampusProgramType;
