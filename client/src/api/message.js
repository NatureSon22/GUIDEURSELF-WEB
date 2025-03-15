const getChatHeads = async () => {
  const response = fetch(`${import.meta.env.VITE_API_URL}/chats/heads`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat heads");
  }

  const { chatHeads } = await response.json();

  return chatHeads || [];
};

export { getChatHeads };
