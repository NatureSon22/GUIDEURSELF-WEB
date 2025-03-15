const getChatHeads = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/heads`, {
    method: "GET",
    credentials: "include",
  });

  const { chatHeads } = await response.json();

  return chatHeads || [];
};

const getMessages = async (receiver_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chats/messages?receiver_id=${receiver_id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const { messages } = await response.json();

  return messages || [];
};

export { getChatHeads, getMessages };
