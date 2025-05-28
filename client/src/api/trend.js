const recordTrend = async () => {
  console.log("record trend")
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
  const getFilter = filter[0].value.replace(/^This\s+/i, "");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/trend/get-trends?filter=${getFilter}`,
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
