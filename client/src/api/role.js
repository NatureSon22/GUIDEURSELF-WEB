const getAllRoles = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { roleTypes } = await response.json();

  return roleTypes;
};

const getAllRolesWithoutPermissions = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { roleTypes } = await response.json();

  const data = roleTypes.filter(
    (roleType) => roleType.permissions.length === 0,
  );

  if (data.length === 0) return [];

  const rolesWithoutPermissions = data.map((roleType) => ({
    value: roleType._id,
    label: roleType.role_type,
  }));

  return rolesWithoutPermissions;
};

const getAllRolesWithPermissions = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { roleTypes } = await response.json();

  const data = roleTypes.filter((roleType) => roleType.permissions.length > 0);

  if (data.length === 0) return [];

  return data;
};

const getRoleById = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { role } = await response.json();
  return role;
};

const addRole = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/add-role`,
    {
      method: "POST",
      credentials: "include",
      body: data,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const updateRolePermissions = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/update-role`,
    {
      method: "PUT",
      credentials: "include",
      body: data,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const updateRoleName = async (form) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/update-role-name`,
    {
      method: "PUT",
      credentials: "include",
      body: form,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();

  return message;
};

const deleteRoleType = async (form) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/delete-role`,
    {
      method: "DELETE",
      credentials: "include",
      body: form,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();

  return message;
};

const deleteRolePermission = async (form) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/delete-role-permission`,
    {
      method: "DELETE",
      credentials: "include",
      body: form,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();

  return message;
};

export {
  getAllRoles,
  getRoleById,
  getAllRolesWithoutPermissions,
  getAllRolesWithPermissions,
  addRole,
  updateRolePermissions,
  updateRoleName,
  deleteRoleType,
  deleteRolePermission,
};
