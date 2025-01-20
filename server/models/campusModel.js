import mongoose from "mongoose";

const markerSchema = new mongoose.Schema({
  marker_name: String,
  latitude: String,
  longitude: String,
  marker_description: String,
  marker_photo_url: String,
});

const floorSchema = new mongoose.Schema({
  floor_name: String,
  floor_photo_url: String, 
  markers: [markerSchema],  
});

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
  campus_name: { type: String },
  campus_code: { type: String },
  campus_phone_number: { type: String  },
  campus_email: { type: String },
  campus_address: { type: String},
  campus_cover_photo_url: { type: String },
  campus_about: { type: String },
  campus_programs: [programSchema],
  latitude: { type: String },
  longitude: { type: String },
  date_added: { type: Date, default: Date.now },
  floors: [floorSchema], 
});

const Campus = mongoose.model("Campus", campusSchema, "campus");

export default Campus;
