import mongoose from "mongoose";

const CampusProgramNameSchema = new mongoose.Schema(
  {
    programtype: {
      type: String,
      required: true,
    },
    programname: {
      type: String,
      required: true,
    },
    date_added: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

const CampusProgramName = mongoose.model(
  "CampusProgramName",
  CampusProgramNameSchema,
  "campusprogramname"
);

export default CampusProgramName;
