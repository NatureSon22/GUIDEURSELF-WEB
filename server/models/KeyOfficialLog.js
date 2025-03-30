import {Schema, model} from "mongoose";

const KeyOfficialLogSchema = new Schema(
  {
    name: {
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

const KeyOfficialLog = model(
  "KeyOfficialLog",
  KeyOfficialLogSchema,
  "keyofficiallog"
);

export default KeyOfficialLog;
