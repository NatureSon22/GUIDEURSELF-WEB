import {Schema, model} from "mongoose";

const CampusProgramTypeSchema = new Schema(
  {
    program_type_name: {
      type: String,
      required: true,
    },
    date_added: {
      type: Date,
      default: Date.now
    },
  });

const CampusProgramType = model(
  "CampusProgramType",
  CampusProgramTypeSchema,
  "campusprogramtype"
);

export default CampusProgramType;
