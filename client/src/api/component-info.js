import formatTitle from "@/utils/formatTitle";

const getAllCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.message);
  }

  const campuses = await response.json();

  const allCampuses = campuses.map((campus) => ({
    value: campus._id,
    label: campus.campus_name,
  }));

  return allCampuses || [];
};

const getGeneralData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7",
    {
    method:"get",
    credentials:"include"
    }
    );
    const data = await response.json();
    return(data); 
  } catch (error) {
    throw new Error("Failed to load system logo!")
  }
};

const getUniversityData = async () => { 
  try {
    const response = await fetch(
      "http://localhost:3000/api/university/675cdd9756f690410f1473b8",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch university data:", error);
    throw error;
  }
};


const getPositions = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/administartiveposition",
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch position!");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
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

  const allRoleTypes = roleTypes
    .filter((roleType) => roleType.permissions.length > 0)
    .map((roleType) => ({
      value: roleType._id,
      label: formatTitle(roleType.role_type),
    }));

  return allRoleTypes || [];
};

export { getAllCampuses, getAllRoleTypes, getGeneralData, getUniversityData, getPositions };
