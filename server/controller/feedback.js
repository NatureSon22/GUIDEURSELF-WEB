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
  const { filter = "All" } = req.query; // Default to "All"
  const { isMultiCampus, campusId } = req.user;

  try {
    let pipeline = [
      // First lookup - get user information
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
          from: "roles", // Adjust this to your actual roles collection name
          localField: "user.role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: "$role" }, // Assuming each user has exactly one role
    ];

    // Filter by campus if not multi-campus
    if (!isMultiCampus) {
      pipeline.push({
        $match: { "user.campus_id": campusId },
      });
    }

    // Apply role-based filtering
    if (filter !== "All") {
      if (filter === "Other") {
        pipeline.push({
          $match: {
            "role.role_type": {
              // Assuming role has a "name" field, adjust if different
              $not: { $regex: "^(student|faculty|staff)$", $options: "i" },
            },
          },
        });
      } else {
        pipeline.push({
          $match: {
            "role.role_type": {
              // Adjust this field name if your role type is stored in a different field
              $regex: filter.trim(),
              $options: "i",
            },
          },
        });
      }
    }

    // Ensure ratings are valid numbers
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
    console.log("Filtered Result:", response);

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
