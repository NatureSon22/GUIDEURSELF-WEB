import {Schema, model} from "mongoose";

const VirtualTourLogSchema = new Schema(
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

const VirtualTourLog = model(
  "VirtualTourLog",
  VirtualTourLogSchema,
  "virtualtourlog"
);

export default VirtualTourLog;
