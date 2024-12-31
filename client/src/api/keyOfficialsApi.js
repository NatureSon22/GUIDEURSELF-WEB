export const fetchKeyOfficials = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/keyofficials", {
        method: "get",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch key officials");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching key officials:", error);
      return [];
    }
  };

