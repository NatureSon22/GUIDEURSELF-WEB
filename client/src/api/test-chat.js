const createConversation = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/messages/create-conversation`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { conversation_id } = await response.json();
  return conversation_id;
};

const getMessages = async (conversationId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/messages/get-messages/${conversationId}`,
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { messages } = await response.json();

  return messages || [];
};

const createMessage = async (conversation_id, message) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/messages/create-message`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation_id, message }),
    },
  );

  if (!response.ok) {
    const { message } = await response.json().catch(() => ({}));
    throw new Error(message || "Failed to send message");
  }

  const { data } = await response.json();

  return data;
};

export { getMessages, createConversation, createMessage };
