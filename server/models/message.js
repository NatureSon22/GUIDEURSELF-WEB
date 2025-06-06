import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  content: { type: String, required: true },
  is_machine_generated: { type: Boolean, required: true, default: false },
  is_helpful: { type: Boolean },
  reason: { type: String },
  category: {
    type: String,
    enum: [
      "Factual Look-Up",
      "Procedural",
      "Tricky or Adversarial",
      "Uncategorized",
    ],
  },
  date_added: { type: Date, default: Date.now },
});

const MessageModel = model("Message", MessageSchema);

export default MessageModel;
