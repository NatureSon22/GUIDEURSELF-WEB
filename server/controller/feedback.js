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

const getTotalFeedback = async (req, res) => {
  const { isMultiCampus, campusId } = req.user;

  try {
    let pipeline = [];

    // Adjust lookup to match the correct Mongoose model reference
    if (!isMultiCampus) {
      pipeline.push(
        {
          $lookup: {
            from: "User", // Match the Mongoose model reference
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $match: { "user.campus_id": campusId } }
      );
    }

    // Aggregation stage for ratings
    pipeline.push({
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    });

    const response = await FeedbackModel.aggregate(pipeline);

    // Initialize rating count object
    const total = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    response.forEach(({ _id, count }) => {
      total[_id] = count;
    });

    // Compute total ratings and average
    const totalFeedbacks = Object.values(total).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalRating = Object.entries(total).reduce(
      (sum, [score, count]) => sum + score * count,
      0
    );
    const averageRating = totalFeedbacks ? totalRating / totalFeedbacks : 0;

    const result = { total, totalRating, totalFeedbacks, averageRating };

    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in getTotalFeedback:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { getTotalFeedback, getFeedback, getAllFeedback, addFeedback };
