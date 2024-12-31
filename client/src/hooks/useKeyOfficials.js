import { useState, useEffect } from "react";

const useKeyOfficials = () => {
  const [officials, setOfficials] = useState([]);
  const [officialToDelete, setOfficialToDelete] = useState(null);

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/keyofficials", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch officials");
      const data = await res.json();
      setOfficials(data);
    } catch (error) {
      console.error("Error fetching key officials:", error);
    }
  };

  const addOfficial = (newOfficial) => {
    setOfficials((prev) => [...prev, newOfficial]);
  };

  const deleteOfficial = async () => {
    if (!officialToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/keyofficials/${officialToDelete._id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to delete official");

      setOfficials((prev) =>
        prev.filter((official) => official._id !== officialToDelete._id)
      );

      setOfficialToDelete(null);
    } catch (error) {
      console.error("Error deleting official:", error);
    }
  };

  const setDeleteTarget = (official) => {
    setOfficialToDelete(official);
  };

  return {
    officials,
    addOfficial,
    deleteOfficial,
    setDeleteTarget,
    officialToDelete,
  };
};

export default useKeyOfficials;
