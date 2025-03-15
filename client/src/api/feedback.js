const getTotalFeedback = async (filter) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback/total-feedback?filter=${filter}`, {
    method: "GET",
    credentials: "include",
  });

  const { result } = await response.json();

  return result;
};

export { getTotalFeedback };
