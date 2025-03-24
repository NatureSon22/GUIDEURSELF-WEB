import TrendModel from "../models/userTrend.js";

const getTrends = async (req, res) => {
  try {
    const { filter } = req.query;
    const { isMultiCampus, campusId } = req.user;
    const today = new Date();
    let startDate = null;

    // Set startDate based on filter
    switch (filter) {
      case "week":
        const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Move to Monday
        startDate = new Date(today);
        startDate.setDate(today.getDate() + difference);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
    }

    // Apply filters dynamically
    const matchStage = {};
    if (startDate) matchStage.date = { $gte: startDate };
    if (!isMultiCampus) matchStage.campus_id = campusId;

    // MongoDB Aggregation Pipeline
    const trends = await TrendModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          usage: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          usage: 1,
        },
      },
    ]);

    res.status(200).json({ trends });
  } catch (error) {
    console.error("Error fetching trends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const recordTrend = async (req, res) => {
  try {
    const userId = req.user.userId;

    await TrendModel.create({ user_id: userId });

    res.status(200).json({ message: "Trend recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getTrends, recordTrend };
