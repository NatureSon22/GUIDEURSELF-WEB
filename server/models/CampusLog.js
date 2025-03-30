import {Schema, model} from "mongoose";

const CampusLogSchema = new Schema(
  {
    campus_name: {
      type: String,
      required: true,
    },
    date_added: {
      type: Date,
      default: Date.now
    },
    updated_by: {
        type: String,
        required: true,
      },
    activity: {
        type: String,
        required: true,
    },
  });

const CampusLog = model(
  "CampusLog",
  CampusLogSchema,
  "campuslog"
);

export default CampusLog;
