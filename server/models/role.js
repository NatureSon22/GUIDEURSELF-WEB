import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
  role_type: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "CategoryRole" }],
  permissions: [
    {
      module: { type: String, default: "" },
      access: { type: [String], default: [] },
    },
  ],
  isMultiCampus: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  date_added: { type: Date, default: Date.now },
  date_updated: { type: Date, default: Date.now },
  date_assigned: { type: Date, default: Date.now },
});

const RoleModel = model("Role", RoleSchema);

export default RoleModel;
