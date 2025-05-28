import CategoryRoleModel from "../models/categoryrole.js";
import RoleModel from "../models/role.js";
import UserModel from "../models/user.js";

const getAllRoleTypes = async (req, res) => {
  try {
    const roleTypes = await RoleModel.find().populate("categories");

    const filteredRoleTypes = roleTypes.filter((role) => !role.isDeleted);

    res.status(200).json({ roleTypes: filteredRoleTypes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCategoryRole = async (req, res) => {
  const { role_id } = req.params;

  if (!role_id) {
    return res.status(400).json({ message: "Missing role ID" });
  }

  try {
    const role = await RoleModel.findById(role_id).populate("categories");

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ categories: role.categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

const addRoleType = async (req, res) => {
  try {
    const { role_type } = req.body;

    let roleExists = await RoleModel.findOne({
      role_type: role_type.toLowerCase(),
    });

    if (roleExists) {
      return res.status(400).json({ message: "Role type already exists" });
    }

    await RoleModel.create({ role_type });

    res.status(200).json({ message: "Role type added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addCategoryRole = async (req, res) => {
  const { role_id, categoryName } = req.body;

  if (!role_id || !categoryName) {
    return res
      .status(400)
      .json({ message: "Missing role ID or category name" });
  }

  try {
    let existingCategory = await CategoryRoleModel.findOne({
      name: categoryName,
    });

    if (!existingCategory) {
      existingCategory = await new CategoryRoleModel({
        name: categoryName,
      }).save();
    }

    const role = await RoleModel.findById(role_id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const categoryAlreadyExists = role.categories.some(
      (catId) => catId.toString() === existingCategory._id.toString()
    );

    if (categoryAlreadyExists) {
      return res
        .status(400)
        .json({ message: "Category already exists in this role" });
    }

    await RoleModel.findByIdAndUpdate(role_id, {
      $addToSet: { categories: existingCategory._id },
    });

    return res.status(200).json({
      message: "Category successfully added to role.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateCategoryRole = async (req, res) => {
  const { role_id, categories } = req.body;

  const categoryArr = categories.map((category) => JSON.parse(category));

  try {
    const categoriesToBeDeleted = categoryArr.filter(
      (category) => category.isDeleted
    );
    const categoriesToBeUpdated = categoryArr.filter(
      (category) => category.isUpdated
    );

    if (categoriesToBeDeleted.length > 0) {
      await Promise.all(
        categoriesToBeDeleted.map((category) =>
          Promise.all([
            CategoryRoleModel.findByIdAndDelete(category._id),
            RoleModel.findByIdAndUpdate(role_id, {
              $pull: { categories: category._id },
            }),
          ])
        )
      );
    }

    if (categoriesToBeUpdated.length > 0) {
      const existingChecks = categoriesToBeUpdated.map(async (category) => {
        const record = await CategoryRoleModel.findOne({
          name: { $regex: new RegExp(`^${category.name}$`, "i") },
        });

        if (record && category._id !== record._id.toString()) {
          return {
            conflict: true,
            name: category.name,
            existingId: record._id.toString(),
          };
        }

        return { conflict: false };
      });

      const existingRecord = await Promise.all(existingChecks);
      const filteredExistingRecord = existingRecord.filter(
        (record) => record.conflict
      );

      if (filteredExistingRecord.length > 0) {
        const names = filteredExistingRecord
          .map((record) => record.name)
          .join(", ");

        return res.status(400).json({ message: `${names} already exists!` });
      }

      await Promise.all(
        categoriesToBeUpdated.map((category) =>
          CategoryRoleModel.findByIdAndUpdate(category._id, {
            name: category.name,
          })
        )
      );
    }

    res.status(200).json({
      message: "Role categories updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { roleId } = req.params;

    const role = await RoleModel.findById(roleId);

    res.status(200).json({ role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateRolePermissions = async (req, res) => {
  try {
    const { role_id, permissions, isMultiCampus } = req.body;
    const parsedPermissions = JSON.parse(permissions);

    console.log(" Parsed permissions: " + parsedPermissions);

    if (!Array.isArray(parsedPermissions)) {
      return res.status(400).json({ message: "Invalid permissions format" });
    }

    await RoleModel.updateOne(
      { _id: role_id },
      {
        $set: {
          permissions: parsedPermissions,
          isMultiCampus: isMultiCampus,
          date_updated: new Date(),
          date_assigned: new Date(),
        },
      }
    );

    res.status(200).json({ message: "Role permissions added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateRoleName = async (req, res) => {
  try {
    const { role_id, role_name } = req.body;

    await RoleModel.updateOne(
      { _id: role_id },
      {
        $set: {
          role_type: role_name,
          date_updated: new Date(),
          date_assigned: new Date(),
        },
      }
    );

    res.status(200).json({ message: "Role name updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ message: "Role ID is required." });
    }

    const role = await RoleModel.findById(role_id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Check if any users are assigned to this role
    // in here should i also consider staus that is pending or blocked?
    const usersWithTheRoles = await UserModel.find({
      role_id,
      status: { $not: { $regex: /^inactive$|^blocked$/i } }, // Case-insensitive match
    });

    if (usersWithTheRoles.length > 0) {
      return res.status(400).json({
        message: "Cannot delete this role while it is assigned to users.",
      });
    }

    await RoleModel.updateOne(
      { _id: role_id },
      {
        $set: {
          isDeleted: true,
          date_updated: new Date(),
        },
      }
    );

    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteRolePermission = async (req, res) => {
  try {
    const { role_id } = req.body;

    const role = await RoleModel.findById(role_id);

    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    await RoleModel.updateOne(
      { _id: role_id },
      {
        $set: {
          permissions: [],
          date_updated: new Date(),
          date_assigned: new Date(),
        },
      }
    );

    res.status(200).json({ message: "Role permissions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getAllRoleTypes,
  getRoleById,
  getCategoryRole,
  addRoleType,
  addCategoryRole,
  updateCategoryRole,
  updateRolePermissions,
  updateRoleName,
  deleteRole,
  deleteRolePermission,
};
