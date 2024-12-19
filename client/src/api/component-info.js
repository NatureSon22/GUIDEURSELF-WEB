const getAllCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campus`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.message);
  }

  const { campuses } = await response.json();

  const allCampuses = campuses.map((campus) => ({
    value: campus._id,
    label: campus.campus_name,
  }));

  return allCampuses || [];
};

const getAllRoleTypes = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.message);
  }

  const { roleTypes } = await response.json();

  const allRoleTypes = roleTypes.map((roleType) => ({
    value: roleType._id,
    label: roleType.role_type,
  }));

  return allRoleTypes || [];
};

export { getAllCampuses, getAllRoleTypes };
