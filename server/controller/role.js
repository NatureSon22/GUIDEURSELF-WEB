import RoleModel from "../models/role.js";

const getAllRoleTypes = async (req, res) => {
  try {
    const roleTypes = await RoleModel.find();

    res.status(200).json({ roleTypes });
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

export { getAllRoleTypes, getRoleById, addRoleType, updateRolePermissions };
