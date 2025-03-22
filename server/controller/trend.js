import TrendModel from "../models/userTrend.js";


const getTrends = async (req, res) => {
  try {
    const { filter } = req.query;
    const { isMultiCampus, campusId } = req.user;
    let startDate;
    const today = new Date();

    // Determine start date based on filter
    switch (filter) {
      case "week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1); // Start of the year
        break;
      default:
        startDate = null; // Default to all time
    }

    // Apply date and campus filter
    const matchStage = { ...(startDate && { date: { $gte: startDate } }) };

    if (!isMultiCampus) {
      matchStage.campus_id = campusId; // Filter by campus if needed
    }

    // MongoDB aggregation pipeline
    const trends = await TrendModel.aggregate([
      { $match: matchStage }, // Apply filters
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
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
