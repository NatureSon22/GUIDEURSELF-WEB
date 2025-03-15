import { Schema, model } from "mongoose";

const MessageFileSchema = new Schema({
  message_id: {
    type: Schema.Types.ObjectId,
    ref: "MessageChat",
    required: true,
  },
  sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  file_url: { type: String, required: true },
  file_type: { type: String, required: true },
  file_name: { type: String, required: true },
  file_size: { type: Number, required: true },
  uploaded_at: { type: Date, default: Date.now },
});

const MessageFileModel = model("MessageFile", MessageFileSchema);

export default MessageFileModel;
