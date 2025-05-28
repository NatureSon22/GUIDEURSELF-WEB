import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
  type: {
    type: String,
    enum: ["chatbot", "virtual-tour", "mobile-app"],
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const FeedbackModel = model("Feedback", FeedbackSchema);

export default FeedbackModel;
