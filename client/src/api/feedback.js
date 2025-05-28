const getTotalFeedback = async (filter, type) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/feedback/total-feedback?filter=${filter}&type=${type}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const { result } = await response.json();

  return result;
};

const getResponseReview = async (filter) => {
  const filterVal = filter?.[0]?.value || "none";
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/message/get-reviews?filter=${filterVal}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { totalMessages, helpfulMessages, unhelpfulMessages } =
    await response.json();

  return { totalMessages, helpfulMessages, unhelpfulMessages };
};

export { getTotalFeedback, getResponseReview };
