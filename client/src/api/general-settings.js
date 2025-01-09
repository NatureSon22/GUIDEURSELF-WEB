const updateLogo = async (file) => {
      try {
        const formData = new FormData();
        formData.append("general_logo_url", file);

        const response = await fetch(`http://localhost:3000/api/general/675cdd2056f690410f1473b7`, {
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
        const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7", {
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
      const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7", {
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
    const response = await fetch("http://localhost:3000/api/general/675cdd2056f690410f1473b7", {
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
  
export {updateLogo, updateAbout, updatePrivacy, updateConditions};