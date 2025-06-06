import mongoose from "mongoose";

const markerSchema = new mongoose.Schema({
  marker_name: { type: String, trim: true, default: "" },
  latitude: { type: Number, required: true},
  longitude: { type: Number, required: true },
  marker_description: { type: String, trim: true, default: ""  },
  category: { type: String, trim: true, default: "" },
  sub_info: { type: mongoose.Schema.Types.Mixed },
  marker_photo_url: { type: String, default: "" },
  date_added: { type: Date, default: Date.now },
});


const floorSchema = new mongoose.Schema({
  floor_name: { type: String, required: true, trim: true },
  floor_photo_url: { type: String, default: "" },
  markers: { type: [markerSchema], default: [] },
  order: { type: Number, required: true, default: 0 },
  date_added: { type: Date, default: Date.now },
});

const programSchema = new mongoose.Schema({
  program_type_id: { type: String, required: true },
  programs: [
    {
      program_name: { type: String, required: true, trim: true },
      majors: { type: [String], default: [] },
    },
  ],
});

const campusSchema = new mongoose.Schema({
  campus_name: { type: String, required: true, trim: true, maxlength: 100 },
  campus_code: { type: String, required: true, trim: true, maxlength: 10 },
  campus_phone_number: { type: String, trim: true },
  campus_email: { 
    type: String, 
    required: true, 
    trim: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  campus_address: { type: String, trim: true },
  campus_cover_photo_url: { type: String, default: "" },
  campus_about: { type: String, trim: true },
  campus_programs: { type: [programSchema], default: [] },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  date_added: { type: Date, default: Date.now },
  date_last_modified: { type: Date, default: Date.now },
  floors: { type: [floorSchema], default: [] },
});

campusSchema.index({ campus_name: 1 });
campusSchema.index({ latitude: 1, longitude: 1 });


const archivedItemSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["floor", "location"] },
  floor_data: { type: floorSchema }, 
  location_data: {
    type: markerSchema,
    default: {},
  }, 
  floor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campus.floors" }, // Add this!
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campus", required: true },
  campus_name: { type: String, trim: true, maxlength: 100 },
  date_archived: { type: Date, default: Date.now },
  date_last_modified: { type: Date, default: Date.now },
});

const ArchivedItem = mongoose.model("ArchivedItem", archivedItemSchema, "archiveditems");
const Campus = mongoose.model("Campus", campusSchema, "campus");
const ArchivedCampus = mongoose.model('ArchivedCampus', campusSchema, 'archivedcampus');

export {Campus, ArchivedCampus, ArchivedItem};


