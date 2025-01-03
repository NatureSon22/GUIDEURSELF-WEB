import UserModel from "../models/user.js";
import sendVerificationEmail from "../service/email.js";
import generatePassword from "password-generator";

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
          role_id: 1,
          campus_name: 1,
          date_created: 1,
          date_assigned: 1,
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
      return res
        .status(409)
        .json({ message: "This email address is already registered." });
    }

    userExists = await UserModel.findOne({ user_number });

    if (userExists) {
      return res
        .status(409)
        .json({ message: "This user number is already registered." }); // Fixed to JSON
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

const bulkAddAccount = async (req, res) => {
  try {
    const { role_id, campus_id, users } = req.body;
    const parsedUsers = JSON.parse(users);

    const bulkUsers = parsedUsers.map((user) => ({
      role_id: role_id,
      campus_id: campus_id,
      user_number: user.user_number,
      username: user.firstname + " " + user.lastname,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      email: user.email,
      password: generatePassword(12, false),
    }));

    const result = await UserModel.insertMany(bulkUsers, { ordered: false });

    // Send emails for successfully inserted users
    await Promise.all(
      result.map(async (user) => {
        await sendVerificationEmail(user.email, user.password);
      })
    );

    res
      .status(200)
      .json({ message: `${result.length} users created successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

const getLoggedInAccount = async (req, res) => {
  try {
    const accountId = req.userId;

    if (!accountId) {
      return res
        .status(400)
        .json({ message: "User ID is missing in the request" });
    }

    const user = await UserModel.findById(accountId).select("-password"); // Exclude sensitive fields like password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
      status,
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
          status,
          date_updated: Date.now(),
          date_assigned: Date.now(),
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

const updateAccountRoleType = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { roleId } = req.body;

    const result = await UserModel.updateOne(
      { _id: accountId },
      {
        $set: {
          role_id: roleId,
          date_updated: Date.now(),
          date_assigned: Date.now(),
        },
      }
    );

    res.status(200).json({
      message: "User role type updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await UserModel.findById(accountId);
    console.log(user.email);

    await UserModel.updateOne(
      { _id: accountId },
      {
        $set: {
          status: "active",
        },
      }
    );

    await sendVerificationEmail(user.email, user.username, user.password);

    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteAccounts = async (req, res) => {
  try {
    const { accountIds } = req.body;
    const accountIdsArray = accountIds.split(",");

    await UserModel.deleteMany({ _id: { $in: accountIdsArray } });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getAllAccounts,
  addAccount,
  getAccount,
  updateAccount,
  updateAccountRoleType,
  verifyAccount,
  bulkAddAccount,
  deleteAccounts,
  getLoggedInAccount,
};
