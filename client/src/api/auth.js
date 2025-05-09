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

const sendVerificationCode = async (email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/send-verification-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { verificationCode } = await response.json();
  return verificationCode;
};

const loginVerification = async (email, password, verificationCodeInput) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/verify-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        verificationCodeInput,
      }),
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

export {
  login,
  isAuthenticated,
  logout,
  loggedInUser,
  sendVerificationCode,
  loginVerification,
};
