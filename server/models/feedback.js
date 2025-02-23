import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema({
  user_number: { type: String, required: true },
  username: { type: String, default: "" },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role_type: { type: String, required: true },  
  campus_name: { type: String, required: true },
  rating: { type: String, required: true },
  commenta: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
});

const Feedback = model('Feedback', FeedbackSchema, 'feedback');

export default Feedback;
