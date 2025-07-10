import cloudinary from "../config/cloudinary.js";
import UserModel from "../models/user.js";
import sendVerificationEmail from "../service/email.js";
import generatePassword from "password-generator";
import fs from "fs";
import { Types } from "mongoose";
import sendPasswordResendEmail from "../service/reset-password.js";

const getAllAccounts = async (req, res, next) => {
  try {
    const { roles } = req.query;
    const { recent } = req.query; // Use query params for filtering
    const rolesFilter = roles
      ? roles.split(",").map((role) => role.trim().toLowerCase())
      : [];
    const userId = req.user?.userId;
    const campusId = req.user?.campusId;
    const isMultiCampus = req.user?.isMultiCampus;

    if (
      !Types.ObjectId.isValid(userId) ||
      (campusId && !Types.ObjectId.isValid(campusId))
    ) {
      return res.status(400).json({ message: "Invalid user or campus ID" });
    }

    // Define match stage based on campus restriction
    const matchStage = {
      $match: {
        _id: { $ne: Types.ObjectId.createFromHexString(userId) }, // Exclude current user
        ...(isMultiCampus
          ? {}
          : { campus_id: Types.ObjectId.createFromHexString(campusId) }), // Filter by campus if not multi-campus
      },
    };

    const aggregationPipeline = [
      matchStage,
      // Exclude deleted users
      {
        $match: {
          status: { $ne: "deleted" },
        },
      },

      // Lookup role information
      {
        $lookup: {
          from: "roles",
          let: { roleId: "$role_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$roleId"] },
                isDeleted: { $ne: true },
              },
            },
            { $project: { role_type: 1, permissions: 1 } },
          ],
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },

      // Lookup campus information
      {
        $lookup: {
          from: "campus",
          let: { campusId: "$campus_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$campusId"] } } },
            { $project: { campus_name: 1 } },
          ],
          as: "campus",
        },
      },
      { $unwind: { path: "$campus", preserveNullAndEmptyArrays: true } },

      // ✅ Lookup category information
      {
        $lookup: {
          from: "categoryroles",
          let: { categoryId: "$category_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
            { $project: { name: 1, description: 1 } }, // include fields you want
          ],
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // Ensure users with deleted roles are filtered out
      {
        $match: { "role.role_type": { $exists: true } },
      },

      // Project final fields
      {
        $project: {
          _id: 1,
          user_number: 1,
          username: 1,
          email: 1,
          firstname: 1,
          middlename: 1,
          lastname: 1,
          role_type: "$role.role_type",
          permissions: "$role.permissions",
          role_id: 1,
          campus_name: "$campus.campus_name",
          category_id: 1,
          category_name: "$category.name", // category name
          category_description: "$category.description", // if you also want description
          date_created: 1,
          date_assigned: 1,
          date_updated: 1,
          status: 1,
        },
      },
      {
        $sort: { date_created: -1 },
      },
    ];

    if (recent) {
      aggregationPipeline.push({ $limit: parseInt(recent, 10) || 10 }); // Limit results
    }

    let users = await UserModel.aggregate(aggregationPipeline);

    if (rolesFilter.length > 0) {
      users = users.filter(
        (user) => !rolesFilter.includes(user.role_type.toLowerCase())
      );
    }

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
      user,
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

      // await Promise.all(
      //   result.map(async (user) => {
      //     await sendVerificationEmail(user.email, user.password);
      //   })
      // );

      return res.status(200).json({
        message: `${result.length} users created successfully`,
        users: result,
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

    // Update date_assigned if role_id, campus_id, or category_id is provided
    if (req.body.role_id || req.body.campus_id || req.body.category_id) {
      updatedData.date_assigned = new Date();
    }

    // Allowed fields for update
    const allowedFields = [
      "role_id",
      "category_id",
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

    // Filter the updatedData to include only allowed fields
    // Also, ensure that only fields with defined values are included for $set
    const filteredData = Object.keys(updatedData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        // Only include the key in $set if its value is not undefined
        if (updatedData[key] !== "undefined") {
          obj[key] = updatedData[key];
        }
        return obj;
      }, {});

    // Initialize the update document with $set operator
    const updateDoc = {
      $set: filteredData,
    };

    // How to make category_id be removed on record if undefined?
    // This block specifically handles the removal of 'category_id'
    // if it's explicitly undefined in the incoming request body.
    // The '$unset' operator in MongoDB removes a field from a document.
    if (updatedData.category_id === "undefined") {
      updateDoc["$unset"] = { category_id: 1 }; // Set value to 1 to remove the field
    }

    //console.log("category id: " + updatedData.category_id);

    // console.log(updateDoc);

    const account = await UserModel.findByIdAndUpdate(
      req.body.accountId,
      updateDoc,
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success message and the updated account
    res.status(200).json({
      message: "User updated successfully",
      account,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Respond with a server error
    res.status(500).json({ message: "Server error" });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const { username, accountId, device = "web" } = req.body;

    // Reject if web and no image uploaded
    if (!req.file && device === "web") {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let photoUrl;

    // Upload photo if present (optional for mobile)
    if (req.file) {
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
    }

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Build update fields dynamically
    const updateFields = {
      date_updated: new Date(),
    };

    if (username) updateFields.username = username;
    if (photoUrl) updateFields.user_photo_url = photoUrl;

    const user = await UserModel.findOneAndUpdate(
      { _id: accountId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    // Safely delete temp file if it exists
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({ message: "Profile updated successfully", user });
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
    const { accountIds } = req.body;

    // Validate input
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({ message: "Invalid account IDs" });
    }

    // Fetch users
    const updatedUsers = await UserModel.find({ _id: { $in: accountIds } });

    if (updatedUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Update status in bulk
    await UserModel.updateMany(
      { _id: { $in: accountIds } },
      { $set: { status: "active", date_updated: new Date() } }
    );

    await Promise.allSettled(
      updatedUsers.map(async (user) => {
        if (user?.email && user?.password) {
          return sendVerificationEmail(
            user.email,
            user.username,
            user.password
          );
        }
      })
    );

    res.status(200).json({ message: "Accounts verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteAccounts = async (req, res) => {
  try {
    const { accountIds } = req.body;

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({ message: "Invalid account IDs" });
    }

    const deletionResult = await UserModel.deleteMany({
      _id: { $in: accountIds },
    });

    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: "No matching accounts found" });
    }

    res.status(200).json({ message: "Accounts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, device = "web" } = req.body;

    const user = await UserModel.findOne({ email });

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

    await sendPasswordResendEmail(user.email, password, device);

    res.status(200).json({
      message: "If the account exists, a password reset has been initiated.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllInactiveAccount = async (req, res) => {
  try {
    const { isMultiCampus, campusId } = req.user;
    console.log(isMultiCampus);

    const filter = { status: "deleted" };

    if (!isMultiCampus) {
      filter.campus_id = campusId;
    }

    const users = await UserModel.find(filter)
      .select(
        "user_number username email firstname middlename lastname role_id campus_name date_created date_updated date_assigned status "
      )
      .populate("role_id", "role_type")
      .populate("campus_id", "campus_name")
      .sort({ date_created: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching inactive accounts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const activateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    await UserModel.updateOne(
      { _id: accountId },
      {
        $set: {
          status: "active",
          date_updated: new Date(),
        },
      }
    );

    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const archiveAccounts = async (req, res) => {
  try {
    const { accountIds } = req.body;

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({ message: "Invalid account IDs" });
    }

    const updateResult = await UserModel.updateMany(
      { _id: { $in: accountIds } },
      { $set: { status: "deleted" } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "No matching accounts found" });
    }

    res.status(200).json({ message: "Accounts archived successfully" });
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
  updatePhoto,
  verifyAccount,
  bulkAddAccount,
  deleteAccounts,
  getLoggedInAccount,
  resetPassword,
  getAllInactiveAccount,
  activateAccount,
  archiveAccounts,
};
