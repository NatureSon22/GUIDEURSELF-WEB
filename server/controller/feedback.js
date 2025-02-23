import FeedbackModel from "../models/feedback.js";

const getFeedback = async (req, res) => {
  try {
    const feedback = await FeedbackModel.find({ user_id: req.user._id });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await FeedbackModel.find();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const newFeedback = new FeedbackModel({
      user_id: req.user.userId,
      rating,
      feedback,
    });
    const savedFeedback = await newFeedback.save();

    res.status(200).json(savedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getFeedback, getAllFeedback, addFeedback };
