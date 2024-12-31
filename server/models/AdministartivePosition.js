import { Schema, model } from 'mongoose';

// Define the schema
const administartivePositionSchema = new Schema({
  administartive_position_name: { type: String, required: true },
});

// Export the model
const AdministartivePosition = model('AdministartivePosition', administartivePositionSchema, 'administartiveposition');

export default AdministartivePosition;
