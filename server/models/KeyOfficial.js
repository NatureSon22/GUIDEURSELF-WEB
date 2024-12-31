import mongoose from "mongoose";

const keyOfficialSchema = new mongoose.Schema({
  administrative_position_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "AdministartivePosition" },
  name: { type: String, required: true },
  key_official_photo_url: { type: String, required: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  is_deleted: { type: Boolean, default: false },
});

const KeyOfficial = mongoose.model("KeyOfficial", keyOfficialSchema, 'keyofficial');

export default KeyOfficial;
