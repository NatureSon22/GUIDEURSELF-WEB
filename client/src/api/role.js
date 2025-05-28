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

const getAllRolesWithCategories = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { roleTypes } = await response.json();
  const filteredRoleTypes = roleTypes.filter(
    (role) => role.categories.length > 0,
  );
  return filteredRoleTypes;
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

const getCategoryRoles = async (role_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/category-role/${role_id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { categories } = await response.json();
  const selectedTypeCategories = categories.map((category) => category.name);
  return selectedTypeCategories;
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

const addCategoryRole = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/add-category-role`,
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

const updateCategoryRole = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/update-category-role`,
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
  getAllRolesWithCategories,
  getRoleById,
  getAllRolesWithoutPermissions,
  getAllRolesWithPermissions,
  getCategoryRoles,
  addRole,
  addCategoryRole,
  updateRolePermissions,
  updateCategoryRole,
  updateRoleName,
  deleteRoleType,
  deleteRolePermission,
};
