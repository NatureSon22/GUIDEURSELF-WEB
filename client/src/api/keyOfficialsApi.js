const fetchKeyOfficials = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/keyofficials", {
      method: "GET", // GET request to fetch data
      credentials: "include", // Include cookies if required
    });

    if (!response.ok) {
      throw new Error("Failed to load key officials!");
    }

    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    throw new Error(error.message || "Failed to load key officials!");
  }
};

const fetchArchivedKeyOfficials = async () => {
  try {
  const res = await fetch("http://localhost:3000/api/keyofficials/archived", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch archived key officials");
  }

  
  const data = await res.json();
  return data;
} catch (error) {
  throw new Error(error.message || "Failed to load key officials!");
}
};


export { fetchKeyOfficials, fetchArchivedKeyOfficials };
