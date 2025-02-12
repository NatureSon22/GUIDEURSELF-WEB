const fetchMarkers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/floors/${selectedFloor._id}/markers`, {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch markers.");
      }
  
      const markers = await response.json();
      return markers;
    } catch (error) {
      console.error("Error fetching markers:", error);
      throw error; 
    }
  };

  const fetchCampusData = async (campusId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/campuses/${campusId}`, {
      method: "GET",
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch campus data");
    }
  
    const data = await response.json();
  
    data.floors.forEach((floor) => {
      if (!floor.markers) {
        floor.markers = []; 
      }
    });
  
    return data;
  };

  export { fetchMarkers, fetchCampusData };