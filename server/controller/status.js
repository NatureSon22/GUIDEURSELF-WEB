import StatusModel from "../models/status.js";

const getAllStatus = async (req, res) => {
  try {
    const status = await StatusModel.find();

    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getAllStatus };
