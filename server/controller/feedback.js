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

const getEveryFeedback = async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find()
      .populate({
        path: "user_id",
        select: "user_number username firstname lastname email role_id campus_id",
        populate: {
          path: "role_id",
          select: "role_type",
        },
      })
      .populate({
        path: "user_id.campus_id",
        select: "campus_name",
      })
      .exec();

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
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

export { getEveryFeedback, getFeedback, getAllFeedback, addFeedback };
