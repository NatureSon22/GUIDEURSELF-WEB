const getSessions = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/session`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { activeSessions, inactiveSessions } = await response.json();

  return {
    activeSessions: activeSessions || [],
    inactiveSessions: inactiveSessions || [],
  };
};

const createSession = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/session/create-session`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ device: "web" }),
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();

  return message;
};

const logoutAllSession = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/session/logout-all-session`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();

  return message;
};

const logoutSession = async (sessionId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/session/logout-session/${sessionId}`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to logout session!");
  }

  const { message } = await response.json();

  return message;
};

export { getSessions, createSession, logoutAllSession, logoutSession };
