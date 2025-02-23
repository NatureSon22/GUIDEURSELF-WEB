import express from 'express';
import Feedback from '../models/feedback.js'; // Adjust the path accordingly

const feedbackRouter = express.Router();

// Get all activity logs
feedbackRouter.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.status(200).send(feedbacks);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default feedbackRouter;