const getAllAccounts = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { users } = await response.json();

  return users || [];
};

const getAccount = async (accountId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/${accountId}`,
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

  return user || {};
};

const addAccount = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/add-account`,
    {
      method: "POST",
      credentials: "include",
      body: data,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const updateAccount = async (accountId, data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/update-account/${accountId}`,
    {
      method: "PUT",
      credentials: "include",
      body: data,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const verifyAccount = async (accountId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/verify-account/${accountId}`,
    {
      method: "PUT",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

export { addAccount, getAccount, getAllAccounts, updateAccount, verifyAccount };
