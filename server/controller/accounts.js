import cloudinary from "../config/cloudinary.js";
import UserModel from "../models/user.js";
import sendVerificationEmail from "../service/email.js";
import generatePassword from "password-generator";
import fs from "fs";
import { Types } from "mongoose";
import sendPasswordResendEmail from "../service/reset-password.js";
import activitylog from "./activitylog.js";

const getAllAccounts = async (req, res, next) => {
  try {
    // Create a $match stage based on isMultiCampus
    // console.log(req.user.isMultiCampus); // true or false
    const matchStage = req.user.isMultiCampus
      ? {
          $match: {
            _id: { $ne: new Types.ObjectId(req.user.userId) }, // Exclude the current user
          },
        }
      : {
          $match: {
            _id: { $ne: new Types.ObjectId(req.user.userId) },
            campus_id: { $eq: new Types.ObjectId(req.user.campusId) }, // Filter by campus
          },
        };

    const users = await UserModel.aggregate([
      matchStage, // Apply the match condition
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }, // Unwind roles array
      },
      {
        $addFields: {
          role_type: "$role.role_type", // Add role_type directly from role
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
        $unwind: { path: "$campus", preserveNullAndEmptyArrays: true }, // Unwind campus array
      },
      {
        $addFields: {
          campus_name: "$campus.campus_name", // Add campus_name directly from campus
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
    console.error("Error fetching accounts:", error);
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

    const bulkUsers = [];
    const existingUsers = [];

    for (const user of parsedUsers) {
      const userExists = await UserModel.findOne({
        $or: [{ user_number: user.user_number }, { email: user.email }],
      });

      if (userExists) {
        existingUsers.push(user);
      } else {
        bulkUsers.push({
          role_id: role_id,
          campus_id: campus_id,
          user_number: user.user_number,
          username: user.firstname + " " + user.lastname,
          firstname: user.firstname,
          middlename: user.middlename,
          lastname: user.lastname,
          email: user.email,
          password: generatePassword(12, false),
        });
      }
    }

    if (bulkUsers.length > 0) {
      const result = await UserModel.insertMany(bulkUsers, { ordered: false });

      await Promise.all(
        result.map(async (user) => {
          await sendVerificationEmail(user.email, user.password);
        })
      );

      return res.status(200).json({
        message: `${result.length} users created successfully`,
        existingUsers,
      });
    }

    res.status(200).json({
      message: "Already user exists are found. Please check existing users",
      existingUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const user = await UserModel.aggregate([
      { $match: { _id: new Types.ObjectId(accountId) } },
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
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getLoggedInAccount = async (req, res) => {
  try {
    const accountId = req.user.userId;

    if (!accountId) {
      return res
        .status(400)
        .json({ message: "User ID is missing in the request" });
    }

    const user = await UserModel.aggregate([
      { $match: { _id: new Types.ObjectId(accountId) } },
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
          role_permissions: "$role.permissions",
          isMultiCampus: "$role.isMultiCampus",
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
          username: 1,
          role_type: 1,
          campus_id: 1,
          user_photo_url: 1,
          role_permissions: 1,
          custom_permissions: 1,
          isMultiCampus: 1,
          campus_name: 1,
          user_number: 1,
          email: 1,
          firstname: 1,
          middlename: 1,
          lastname: 1,
          password: 1,
        },
      },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      custom_permissions: { granted, revoked },
      role_permissions,
    } = user[0];

    const based_permissions = [...role_permissions];
    const granted_permissions = granted ? [...granted] : [];
    const revoked_permissions = revoked ? [...revoked] : [];

    // Handle granted permissions
    granted_permissions.forEach((permission) => {
      const index = based_permissions.findIndex(
        (p) => p.module === permission.module
      );

      if (index !== -1) {
        // Merge access permissions
        based_permissions[index].access = Array.from(
          new Set([...based_permissions[index].access, ...permission.access])
        );
      } else {
        // Add new module with permissions
        based_permissions.push({
          module: permission.module,
          access: [...permission.access],
        });
      }
    });

    // Handle revoked permissions
    revoked_permissions.forEach((permission) => {
      const index = based_permissions.findIndex(
        (p) => p.module === permission.module
      );

      if (index !== -1) {
        // Remove revoked permissions
        based_permissions[index].access = based_permissions[
          index
        ].access.filter((access) => !permission.access.includes(access));

        // Remove the module if no access permissions are left
        if (based_permissions[index].access.length === 0) {
          based_permissions.splice(index, 1);
        }
      }
    });

    delete user[0].custom_permissions;
    delete user[0].role_permissions;
    user[0].permissions = based_permissions;

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      date_updated: new Date(),
    };

    if (req.body.role_id || req.body.campus_id) {
      updatedData.date_assigned = new Date();
    }

    const allowedFields = [
      "role_id",
      "campus_id",
      "user_number",
      "firstname",
      "middlename",
      "lastname",
      "username",
      "email",
      "password",
      "status",
      "date_assigned",
    ];

    const filteredData = Object.keys(updatedData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedData[key];
        return obj;
      }, {});

    const account = await UserModel.findByIdAndUpdate(
      { _id: updatedData.accountId },
      { $set: filteredData },
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updatePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let photoUrl;
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "profiles",
        resource_type: "image",
      });
      photoUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({
        message: "Failed to upload profile photo",
        error: error.message,
      });
    }

    const { accountId } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    await UserModel.updateOne(
      { _id: accountId },
      { $set: { user_photo_url: photoUrl, date_updated: new Date() } }
    );

    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "Photo updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateAccountRoleType = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { roleId, grantedPermissions, revokedPermissions } = req.body;

    const updateFields = {
      role_id: roleId,
      date_updated: Date.now(),
      date_assigned: Date.now(),
    };

    if (
      (grantedPermissions && grantedPermissions.length > 0) ||
      (revokedPermissions && revokedPermissions.length > 0)
    ) {
      updateFields.custom_permissions = {
        granted: grantedPermissions || [],
        revoked: revokedPermissions || [],
      };
    }

    // Perform update
    await UserModel.updateOne({ _id: accountId }, { $set: updateFields });

    res.status(200).json({ message: "User role type updated successfully" });
  } catch (error) {
    console.error("Error updating account role type:", error);
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

const resetPassword = async (req, res) => {
  try {
    const { email, campusId } = req.body;

    const user = await UserModel.findOne({ email, campus_id: campusId });

    if (!user) {
      return res.status(200).json({
        message: "If the account exists, a password reset has been initiated.",
      });
    }

    const password = generatePassword(12, false);

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          password: password,
          date_updated: new Date(),
        },
      }
    );

    await sendPasswordResendEmail(user.email, password);

    res.status(200).json({
      message: "If the account exists, a password reset has been initiated.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getAllAccounts,
  addAccount,
  getAccount,
  updateAccount,
  updateAccountRoleType,
  updatePhoto,
  verifyAccount,
  bulkAddAccount,
  deleteAccounts,
  getLoggedInAccount,
  resetPassword,
};
