import { Schema, model } from "mongoose";

const ConversationSchema = new Schema(
  {
    user_id: { type: String, required: true },
    conversation_id: { type: String, required: true },
    conversation_name: { type: String, required: true },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    date: { type: Date, default: Date.now },
  },
);

const ConversationModel = model("Conversation", ConversationSchema);

export default ConversationModel;
