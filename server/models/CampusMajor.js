import mongoose from "mongoose";

const CampusMajorSchema = new mongoose.Schema(
  {
    programname: {
      type: String,
      required: true,
    },
    majorname: {
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

const CampusMajor = mongoose.model(
  "CampusMajor",
  CampusMajorSchema,
  "campusmajor"
);

export default CampusMajor;
