import RoleModel from "../models/role.js";
import UserModel from "../models/user.js";

const getAllRoleTypes = async (req, res) => {
  try {
    const roleTypes = await RoleModel.find();

    const filteredRoleTypes = roleTypes.filter((role) => !role.isDeleted);

    res.status(200).json({ roleTypes: filteredRoleTypes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
  addRoleType,
  updateRolePermissions,
  updateRoleName,
  deleteRole,
  deleteRolePermission,
};
