const updateUniversityLogo = async (file) => {
      try {
        const formData = new FormData();
        formData.append("university_logo_url", file);

        const response = await fetch(`http://localhost:3000/api/university/675cdd9756f690410f1473b8`, {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
    } catch (error) {
      throw new Error("Failed to upload system logo!");
    }
};

const updateVectorLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("university_vector_url", file);

    const response = await fetch(`http://localhost:3000/api/university/675cdd9756f690410f1473b8`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
} catch (error) {
  throw new Error("Failed to upload system logo!");
}
};

const updateHistory = async (history) => {
    try {
      const response = await fetch("http://localhost:3000/api/university/675cdd9756f690410f1473b8", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          university_history: history,
        }),
        credentials: "include",
      });

    } catch (error) {
      throw new Error("Failed to update university history!");
    }
};

const updateVision = async (vision) => {
  try {
    const response = await fetch("http://localhost:3000/api/university/675cdd9756f690410f1473b8", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        university_vision: vision,
      }),
      credentials: "include",
    });

  } catch (error) {
    throw new Error("Failed to update university vision!");
  }
};

const updateMission = async (mission) => {
  try {
    const response = await fetch("http://localhost:3000/api/university/675cdd9756f690410f1473b8", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        university_mission: mission,
      }),
      credentials: "include",
    });

  } catch (error) {
    throw new Error("Failed to update university mission!");
  }
};

const updateCoreValues = async (corevalues) => {
  try {
    const response = await fetch("http://localhost:3000/api/university/675cdd9756f690410f1473b8", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        university_core_values: corevalues,
      }),
      credentials: "include",
    });

  } catch (error) {
    throw new Error("Failed to update university mission!");
  }
};

const addPosition = async (positionName) => {
  const response = await fetch("http://localhost:3000/api/administartiveposition", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ administartive_position_name: positionName }),
  });

  return response.json(); // Return the added position
};

export {updateUniversityLogo, updateVectorLogo, updateHistory, updateVision, updateMission, updateCoreValues, addPosition};