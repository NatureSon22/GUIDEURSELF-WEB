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
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/message/get-messages`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { messages } = await response.json();
    return messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

const getMessagesClassification = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/message/message-classifications`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { categoriesCount } = await response.json();
  const chartData = Object.entries(categoriesCount).map(([key, value]) => ({
    category: key,
    count: value,
  }));

  return chartData;
};

const botUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/message/bot-usage`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { data } = await response.json();
  return data;
};

export { getChatHeads, getMessages, getMessagesClassification, botUsage };
