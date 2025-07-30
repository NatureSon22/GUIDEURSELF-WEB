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
      .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order (latest first)
      .populate({
        path: "user_id",
        select:
          "user_number username firstname lastname email role_id campus_id",
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
    const { rating, feedback, type } = req.body;
    const newFeedback = new FeedbackModel({
      user_id: req.user.userId,
      rating,
      feedback,
      type,
    });
    const savedFeedback = await newFeedback.save();

    res.status(200).json(savedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalFeedback = async (req, res) => {
  // "chatbot", "virtual-tour", "mobile-app"
  const { filter = "mobile-app", type = "mobile-app" } = req.query;
  const { isMultiCampus, campusId } = req.user;

  console.log(`type: ${type}`);

  try {
    let pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Second lookup - get role information
      {
        $lookup: {
          from: "roles",
          localField: "user.role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: "$role" },
      // { $match: { type } },
    ];

    // Filter by campus if not multi-campus
    if (!isMultiCampus) {
      pipeline.push({
        $match: { "user.campus_id": campusId },
      });
    }

    pipeline.push({
      $match: {
        $or: [
          { type: type },
          {
            $and: [
              { $or: [{ type: { $exists: false } }, { type: null }] },
              { $expr: { $eq: [type, "mobile-app"] } },
            ],
          },
        ],
      },
    });

    pipeline.push({
      $match: {
        rating: { $in: [1, 2, 3, 4, 5] },
      },
    });

    // Group by rating
    pipeline.push({
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    });

    const response = await FeedbackModel.aggregate(pipeline);

    // Initialize rating counts
    const total = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    response.forEach(({ _id, count }) => {
      total[_id] = count || 0;
    });

    // Compute total ratings and average
    const totalFeedbacks = Object.values(total).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalRating = Object.entries(total).reduce(
      (sum, [score, count]) => sum + Number(score) * count,
      0
    );
    const averageRating = totalFeedbacks ? totalRating / totalFeedbacks : 0;

    res.status(200).json({
      result: {
        total,
        totalRating,
        totalFeedbacks,
        averageRating: parseFloat(averageRating.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error in getTotalFeedback:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export {
  getEveryFeedback,
  getTotalFeedback,
  getFeedback,
  getAllFeedback,
  addFeedback,
};
