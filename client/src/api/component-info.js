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

const fetchCampuses = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campuses");
  }
  return response.json();
};

const getGeneralData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`,
      {
        method: "get",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to load system logo!");
  }
};

const getProgramTypeData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/campusprogramtypes`,
      {
        method: "get",
        credentials: "include",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to load program type!");
  }
};

const getProgramNameData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/campusprogramnames`,
      {
        method: "get",
        credentials: "include",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to load program name!");
  }
};

const getMajorData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/campusmajors`,
      {
        method: "get",
        credentials: "include",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to load majors!");
  }
};

const getUniversityData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/university/675cdd9756f690410f1473b8`,
      {
        method: "GET",
        credentials: "include",
      },
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
      `${import.meta.env.VITE_API_URL}/administartiveposition`,
      {
        credentials: "include",
      },
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

const getAllActLog = async (recent = "") => {
  try {
    const response = await fetch(
      recent
        ? `${import.meta.env.VITE_API_URL}/activitylogs?recent=${recent}`
        : `${import.meta.env.VITE_API_URL}/activitylogs`,
      {
        credentials: "include",
      },
    ); // Ensure this endpoint is correct
    if (!response.ok) {
      throw new Error("Failed to fetch activity logs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
};

const getAllFeedback = async () => {
  try {
    // Fetch feedback data
    const feedbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/feedback/every-feedback`, {
      credentials: "include",
    });

    if (!feedbackResponse.ok) {
      throw new Error("Failed to fetch feedback");
    }

    const feedbackData = await feedbackResponse.json();
    console.log("Feedback Data:", feedbackData); // Log feedback data

    // Fetch all campuses
    const campusesResponse = await fetch(`${import.meta.env.VITE_API_URL}/campuses`, {
      credentials: "include",
    });

    if (!campusesResponse.ok) {
      throw new Error("Failed to fetch campuses");
    }

    const campusesData = await campusesResponse.json();
    console.log("Campuses Data:", campusesData); // Log campuses data

    // Create a map of campus IDs to campus names
    const campusMap = campusesData.reduce((map, campus) => {
      map[campus._id] = campus.campus_name;
      return map;
    }, {});

    console.log("Campus Map:", campusMap); // Log the campus map

    // Map feedback data to include campus names
    return feedbackData.map((feedback) => {
      const campusId = feedback.user_id?.campus_id;
      const campusName = campusMap[campusId] || "N/A"; // Get campus name from the map

      return {
        user_number: feedback.user_id?.user_number || "N/A",
        username: feedback.user_id?.username || "N/A",
        email: feedback.user_id?.email || "N/A",
        firstname: feedback.user_id?.firstname || "N/A",
        lastname: feedback.user_id?.lastname || "N/A",
        role_type: feedback.user_id?.role_id?.role_type || "N/A",
        campus_name: campusName, // Use the mapped campus name
        rating: feedback.rating,
        comments: feedback.feedback,
        date_submitted: feedback.date,
      };
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};


export {getAllFeedback, getAllActLog, fetchCampuses, getAllCampuses, getProgramTypeData, getMajorData, getProgramNameData, getAllRoleTypes, getAllStatus, getGeneralData, getUniversityData, getPositions };
