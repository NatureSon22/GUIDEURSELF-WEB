import { Schema, model } from "mongoose";

const MessageChatSchema = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  files: [
    {
      url: { type: String },
      type: { type: String, enum: ["img", "file"] },
    },
  ],
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  timestamp: { type: Date, default: Date.now },
});

const MessageChatModel = model("MessageChat", MessageChatSchema);

export default MessageChatModel;
