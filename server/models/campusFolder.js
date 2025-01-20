import { model, Schema, Types } from "mongoose";

const CampusFolderSchema = new Schema({
  folder_name: { type: String, required: true },
  folder_id: { type: String, required: true },
  campus_id: { type: Types.ObjectId },
});

const CampusFolderModel = model("CampusFolder", CampusFolderSchema);

export default CampusFolderModel;
