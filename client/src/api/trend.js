const recordTrend = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/trend/record-trend`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const getTrends = async (filter) => {

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/trend/get-trends?filter=${filter[0].value}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { trends } = await response.json();

  return trends || [];
};

export { getTrends, recordTrend };
