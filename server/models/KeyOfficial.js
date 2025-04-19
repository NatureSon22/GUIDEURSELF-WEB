import mongoose from "mongoose";

const keyOfficialSchema = new mongoose.Schema({
  position_name: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  key_official_photo_url: { 
    type: String, 
    required: true 
  },
  campus_name: { 
    type: String,
  },
  college_name: { 
    type: String,
  },
  date_added: { 
    type: Date,  
    required: true 
  },
  date_last_modified: { 
    type: Date, 
    default: Date.now 
  },
});

const KeyOfficial = mongoose.model("KeyOfficial", keyOfficialSchema, 'keyofficial');
const ArchivedKeyOfficial = mongoose.model("ArchivedKeyOfficial", keyOfficialSchema, 'archivedkeyofficial');

export {KeyOfficial, ArchivedKeyOfficial};
