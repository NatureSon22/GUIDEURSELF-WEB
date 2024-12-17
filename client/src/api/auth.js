const login = async ({ email, password }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(response.message);
  }

  return response.json();
};

const isAuthenticated = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/validate-token`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(response.message);
  }

  return response.json();
};

export { login, isAuthenticated };
