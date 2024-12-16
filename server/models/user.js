import { Schema } from "mongoose";

const UserSchema = new Schema({
  user_number: { type: String, required: true },
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  middlename: { type: String, default: "" },
  lastname: { type: String, required: true },
  role_id: { type: Schema.Types.ObjectId, required: true },
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
  campus_id: { type: Schema.Types.ObjectId, required: true },
  password: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
  user_photo_url: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default UserSchema;
