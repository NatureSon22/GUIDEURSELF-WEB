import { Schema, model, Types } from "mongoose";

const TrendSchema = new Schema({
  user_id: { type: Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, default: Date.now },
});

const TrendModel = model("Trend", TrendSchema);

export default TrendModel;