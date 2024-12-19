import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
  role_type: { type: String, required: true },
  permissions: [
    {
      module: { type: String, required: true },
      access: { type: [String], required: true },
    },
  ],
});

const RoleModel = model("Role", RoleSchema);

export default RoleModel;
