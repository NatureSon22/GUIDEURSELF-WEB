import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  device: { type: String, required: true }, // e.g., "Web", "Laptop FAHRQUI"
  ip: { type: String },
  userAgent: { type: Object },
  loginTime: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const SessionModel = model("Session", sessionSchema);

export default SessionModel;
