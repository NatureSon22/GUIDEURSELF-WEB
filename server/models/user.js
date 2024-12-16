import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  user_number: { type: String, required: false },
  username: { type: String, default: "" },
  email: { type: String, required: false, unique: false },
  firstname: { type: String, required: false },
  middlename: { type: String, default: "" },
  lastname: { type: String, required: false },
  role_id: { type: Schema.Types.ObjectId, required: false },
  custom_permissions: {
    granted: [
      {
        module: { type: String, required: false },
        access: { type: [String], required: false },
      },
    ],
    revoked: [
      {
        module: { type: String, required: false },
        access: { type: [String], required: false },
      },
    ],
  },
  campus_id: { type: Schema.Types.ObjectId, required: false },
  password: { type: String, required: false },
  date_created: { type: Date, default: Date.now },
  user_photo_url: { type: String, default: "" },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active",
  },
});

const UserModel = model("User", UserSchema);

export default UserModel;
