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

const deletePosition = async (id) => {
  const response = await fetch(`http://localhost:3000/api/administartiveposition/${id}`, {
    method: 'DELETE',
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error('Failed to delete position');
  }

  return response.json();
};

const updatePosition = async (id, updatedName) => {
  const response = await fetch(`http://localhost:3000/api/administartiveposition/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ position_name: updatedName }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update position");
  }

  return await response.json();
};

const updateType = async (id, updatedType) => {
  const response = await fetch(`http://localhost:3000/api/campusprogramtypes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({program_type_name: updatedType }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update position");
  }

  return await response.json();
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
    body: JSON.stringify({ position_name: positionName }),
  });

  return response.json(); // Return the added position
};


const addType= async (typeName) => {
  const response = await fetch("http://localhost:3000/api/campusprogramtypes", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ program_type_name: typeName}),
  });

  return response.json(); // Return the added position
};

const uploadFloorImage = async (campusId, formData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/campuses/${campusId}`, {
      method: "PUT", // Use PUT to update an existing campus (and floors)
      credentials: "include",
      body: formData, // Send the FormData object as the body
    });

    if (!response.ok) {
      throw new Error("Failed to upload floor.");
    }

    const data = await response.json();
    return data; // Returning the response data
  } catch (error) {
    console.error("Error uploading floor:", error);
    throw new Error("Failed to upload floor.");
  }
};

const addProgram= async (programName) => {
  const response = await fetch("http://localhost:3000/api/campusprogramnames", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ programname: programName }),
  });

  return response.json(); // Return the added position
};

export {
  updateUniversityLogo,
  updateType, 
  updatePosition, 
  updateVectorLogo, 
  deletePosition, 
  updateHistory, 
  updateVision, 
  updateMission, 
  updateCoreValues, 
  addPosition, 
  addType,
  addProgram,
  uploadFloorImage,
};