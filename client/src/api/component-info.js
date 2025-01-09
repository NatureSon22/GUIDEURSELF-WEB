import formatTitle from "@/utils/formatTitle";

const getAllCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const campuses = await response.json();

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
    const { message } = await response.json();
    throw new Error(message);
  }

  const { roleTypes } = await response.json();

  const allRoleTypes = roleTypes
    .filter((roleType) => roleType.permissions.length > 0)
    .map((roleType) => ({
      value: roleType._id,
      label: formatTitle(roleType.role_type),
    }));

  return allRoleTypes || [];
};

const getAllStatus = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/status`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { status } = await response.json();

  const allStatus = status.map((stat) => ({
    value: stat._id,
    label: formatTitle(stat.status_type),
  }));

  return allStatus || [];
};

export { getAllCampuses, getAllRoleTypes, getAllStatus };
