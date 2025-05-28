import { Schema, model } from "mongoose";

const CategoryRoleSchema = new Schema({
  name: { type: String },
  description: { type: String },
});

const CategoryRoleModel = model("CategoryRole", CategoryRoleSchema);

export default CategoryRoleModel;
