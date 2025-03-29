import TrendModel from "../models/userTrend.js";

const getTrends = async (req, res) => {
  try {
    const { filter } = req.query;
    const { isMultiCampus, campusId } = req.user;
    const today = new Date();
    let startDate = null;
    let endDate = new Date(today);

    // Set startDate based on filter
    switch (filter) {
      case "week":
        startDate = new Date(today);
        const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Move back to Monday
        startDate.setDate(today.getDate() + difference);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        // If no valid filter, default to last 30 days
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
    }

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    // Apply filters dynamically
    const matchStage = {};
    if (startDate) matchStage.date = { $gte: startDate, $lte: endDate };
    if (!isMultiCampus) matchStage.campus_id = campusId;

    // Fetch trends data
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

    // Improved date filling with more robust method
    const filledTrends = [];
    const trendsMap = new Map(trends.map((t) => [t.date, t.usage]));

    // Create a function to format date as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    // Clone the dates to avoid mutation
    let currentDate = new Date(startDate);
    const finalEndDate = new Date(endDate);

    while (currentDate <= finalEndDate) {
      const dateStr = formatDate(currentDate);
      filledTrends.push({
        date: dateStr,
        usage: trendsMap.get(dateStr) || 0,
      });

      // Create a new date to avoid mutation
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Optional: Sort the filled trends by date to ensure correct order
    filledTrends.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      trends: filledTrends,
      meta: {
        startDate: formatDate(startDate),
        endDate: formatDate(finalEndDate),
        totalDays: filledTrends.length,
      },
    });
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
