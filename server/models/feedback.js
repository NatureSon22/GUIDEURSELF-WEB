import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema({
// <<<<<<< HEAD
//   user_number: { type: String, required: true },
//   username: { type: String, default: "" },
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   role_type: { type: String, required: true },  
//   campus_name: { type: String, required: true },
//   rating: { type: String, required: true },
//   commenta: { type: String, required: true },
//   date_created: { type: Date, default: Date.now },
// });

// const Feedback = model('Feedback', FeedbackSchema, 'feedback');

// export default Feedback;
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const FeedbackModel = model("Feedback", FeedbackSchema);

export default FeedbackModel;
