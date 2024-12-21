import mongoose from "mongoose";
import UserModel from "../models/user.js";
const getAllAccounts = async (req, res, next) => {
  try {
    const users = await UserModel.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: { path: "$role", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          role_type: "$role.role_type",
        },
      },
      {
        $lookup: {
          from: "campus",
          localField: "campus_id",
          foreignField: "_id",
          as: "campus",
        },
      },
      {
        $unwind: { path: "$campus", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          campus_name: "$campus.campus_name",
        },
      },
      {
        $project: {
          _id: 1,
          user_number: 1,
          username: 1,
          email: 1,
          firstname: 1,
          middlename: 1,
          lastname: 1,
          role_type: 1,
          campus_name: 1,
          date_created: 1,
          status: 1,
        },
      },
    ]);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addAccount = async (req, res) => {
  try {
    const {
      role_id,
      campus_id,
      user_number,
      username,
      firstname,
      middlename,
      lastname,
      email,
      password,
    } = req.body;

    let userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    userExists = await UserModel.findOne({ user_number });

    if (userExists) {
      return res.status(409).json({ message: "User number already exists" }); // Fixed to JSON
    }

    const user = new UserModel({
      role_id,
      campus_id,
      user_number,
      username,
      firstname,
      middlename,
      lastname,
      email,
      password,
    });
    await user.save();

    res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const user = await UserModel.findById(accountId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const {
      role_id,
      campus_id,
      user_number,
      username,
      firstname,
      middlename,
      lastname,
      email,
      password,
    } = req.body;

    await UserModel.updateOne(
      { _id: accountId },
      {
        $set: {
          role_id,
          campus_id,
          user_number,
          firstname,
          middlename,
          lastname,
          username,
          email,
          password,
        },
      }
    );

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllAccounts, addAccount, getAccount, updateAccount };
