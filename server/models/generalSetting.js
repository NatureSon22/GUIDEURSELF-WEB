import mongoose from 'mongoose';

const generalSettingsSchema = new mongoose.Schema({
  general_logo_url: String,
  general_about: String,
  privacy_policies: String,
  terms_conditions: String,
  // Add other fields as necessary
});

const generalSettings = mongoose.model('GeneralSettings', generalSettingsSchema, 'generalsettings');

export default generalSettings;
