const getGeneralData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/general/get-info`,
      {
        method: "get",
      },
    );
    const { general } = await response.json();
    return general ? general[0] : [];
  } catch (error) {
    throw new Error("Failed to load system data!");
  }
};

const updateLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("general_logo_url", file);

    await fetch(`${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
  } catch (error) {
    throw new Error("Failed to upload system logo!");
  }
};

const updateAbout = async (about) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        general_about: about,
      }),
      credentials: "include",
    });
  } catch (error) {
    throw new Error("Failed to update system about!");
  }
};

const updatePrivacy = async (policies) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privacy_policies: policies,
      }),
      credentials: "include",
    });
  } catch (error) {
    throw new Error("Failed to update system about!");
  }
};

const updateConditions = async (conditions) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/general/675cdd2056f690410f1473b7`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        terms_conditions: conditions,
      }),
      credentials: "include",
    });
  } catch (error) {
    throw new Error("Failed to update system about!");
  }
};

export {
  updateLogo,
  updateAbout,
  updatePrivacy,
  updateConditions,
  getGeneralData,
};
