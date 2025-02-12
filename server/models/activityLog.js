import { Schema, model } from "mongoose";

const ActivityLogSchema = new Schema({
  user_number: { type: String, required: true },
  username: { type: String, default: "" },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role_type: { type: String, required: true },  
  campus_name: { type: String, required: true },
  action: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
});

const ActivityLog = model('ActivityLog', ActivityLogSchema, 'activitylog');

export default ActivityLog;
