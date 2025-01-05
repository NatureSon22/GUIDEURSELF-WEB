import mongoose from 'mongoose';

const universityManagementSchema = new mongoose.Schema({
  university_logo_url: String,
  university_vector_url: String,
  university_history: String,
  university_vision: String,
  university_mission: String,
  university_core_values: [String],
  // Add other fields as necessary
});

const UniversityManagement = mongoose.model('UniversityManagement', universityManagementSchema, 'universitymanagement');

export default UniversityManagement;
