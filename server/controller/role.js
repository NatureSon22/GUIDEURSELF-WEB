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
    const { role_type, permissions } = req.body;

    // Sample permissions format
    // const permissions = [
    //   {
    //     module: "role-management",
    //     access: ["add-role", "edit-role"],
    //   },
    // ];
    
    // const formData = new FormData();
    // formData.append("role_type", "Admin");
    // formData.append("permissions", JSON.stringify(permissions));

    // Parse permissions if it's sent as a JSON string
    const parsedPermissions = Array.isArray(permissions)
      ? permissions
      : JSON.parse(permissions);

    if (
      !Array.isArray(parsedPermissions) ||
      !parsedPermissions.every(
        (item) => item.module && Array.isArray(item.access)
      )
    ) {
      return res.status(400).json({ message: "Invalid permissions format" });
    }

    const promises = parsedPermissions.map((permission) =>
      RoleModel.create({
        role_type,
        permissions: [
          {
            module: permission.module,
            access: permission.access,
          },
        ],
      })
    );

    await Promise.all(promises);

    res.status(200).json({ message: "Role type added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllRoleTypes, addRoleType };
