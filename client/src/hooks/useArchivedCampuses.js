import { useEffect, useState } from "react";

const useArchivedCampuses = () => {
  const [archivedCampuses, setArchivedCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchivedCampuses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/archived-campuses`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setArchivedCampuses(data);m
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedCampuses();
  }, []);

  return { archivedCampuses, loading, error };
};

export default useArchivedCampuses;