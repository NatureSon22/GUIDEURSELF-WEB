const login = async ({ email, password, rememberMe }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, rememberMe, device: "web" }),
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
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
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const loggedInUser = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/logged-in-account`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { user } = await response.json();

  return user ? user[0] : {};
};

const logout = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

export { login, isAuthenticated, logout, loggedInUser };
