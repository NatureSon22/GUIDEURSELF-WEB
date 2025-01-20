import { Schema, model, Types } from "mongoose";

const DocumentSchema = new Schema({
  folder_id: { type: String, required: true },
  file_name: { type: String, required: true },
  published_by: { type: Types.ObjectId, required: true },
  date_and_time: { type: Date, default: Date.now },
  contributors: [{ type: Types.ObjectId, required: true }],
  document_type: {
    type: String,
    enum: ["created-document", "uploaded-document", "imported-web"],
    required: true,
  },
  document_url: { type: String },
  content_url: { type: String },
  date_last_modified: { type: Date, default: Date.now },
  status: { type: String, required: true },
  visibility: {
    type: String,
    enum: ["onlyMe", "viewOnly", "viewAndEdit"],
    required: true,
  },
});

const DocumentModel = model("Document", DocumentSchema);

export default DocumentModel;
