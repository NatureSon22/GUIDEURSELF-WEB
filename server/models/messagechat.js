import { Schema, model } from "mongoose";

const MessageChatSchema = new Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
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
  },
  { timestamps: true }
);

MessageChatSchema.index({ sender_id: 1, receiver_id: 1, createdAt: -1 });

const MessageChatModel = model("MessageChat", MessageChatSchema);

export default MessageChatModel;
