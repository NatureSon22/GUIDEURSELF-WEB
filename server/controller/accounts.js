import UserModel from "../models/user.js";
const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllUsers };
