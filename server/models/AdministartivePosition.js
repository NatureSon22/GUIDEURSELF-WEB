import { Schema, model } from 'mongoose';

// Define the schema
const administartivePositionSchema = new Schema({
  position_name: { 
    type: String, 
    required: true 
  },
  date_added: { 
    type: Date, 
    default: Date.now 
  },
});

// Export the model
const AdministartivePosition = model(
  'AdministartivePosition',
  administartivePositionSchema,
  'administartiveposition');

export default AdministartivePosition;
