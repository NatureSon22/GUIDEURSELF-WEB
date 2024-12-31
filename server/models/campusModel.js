import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  program_type_id: String,
  programs: [
    {
      program_name: String,
      majors: [String],
    },
  ],
});

const campusSchema = new mongoose.Schema({
  campus_name: { type: String, required: true },
  campus_code: { type: String, required: true },
  campus_phone_number: { type: String, required: true },
  campus_email: { type: String, required: true },
  campus_address: { type: String, required: true },
  campus_cover_photo_url: { type: String, required: true },
  campus_about: { type: String },
  campus_programs: [programSchema],
  latitude: { type: String },
  longitude: { type: String },
  date_added: { type: Date, default: Date.now },
});

const Campus = mongoose.model("Campus", campusSchema, "campus");
export default Campus;
