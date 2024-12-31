import CampusModel from "../models/campus.js";

const getAllCampuses = async (req, res) => {
  try {
    const campuses = await CampusModel.find();
    res.status(200).json({ campuses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllCampuses };
