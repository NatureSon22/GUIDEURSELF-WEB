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

export { recordTrend };
