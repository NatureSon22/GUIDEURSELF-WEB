import TrendModel from "../models/userTrend.js";

const recordTrend = async (req, res) => {
  try {
    const userId = req.user.userId;

    await TrendModel.create({ user_id: userId });

    res.status(200).json({ message: "Trend recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { recordTrend };
