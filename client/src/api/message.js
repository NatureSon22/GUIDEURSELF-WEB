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


const getMessages = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/message/get-messages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export { getChatHeads, getMessages};
