import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  user_number: { type: String, required: true },
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  middlename: { type: String, default: "" },
  lastname: { type: String, required: true },
  role_id: { type: Schema.Types.ObjectId, required: true, ref: "Role" },
  category_id: { type: Schema.Types.ObjectId, ref: "CategoryRole" },
  custom_permissions: {
    granted: [
      {
        module: { type: String, required: true },
        access: { type: [String], required: true },
      },
    ],
    revoked: [
      {
        module: { type: String, required: true },
        access: { type: [String], required: true },
      },
    ],
  },
  campus_id: { type: Schema.Types.ObjectId, required: true, ref: "Campus" },
  password: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
  date_updated: { type: Date, default: Date.now },
  date_assigned: { type: Date, default: Date.now },
  user_photo_url: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending", "deleted"],
    default: "pending",
  },
});

const UserModel = model("User", UserSchema);

export default UserModel;
