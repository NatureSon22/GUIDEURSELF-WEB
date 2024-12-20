const getAllAccounts = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts`);

  if (!response.ok) {
    throw new Error(response.message);
  }

  const { users } = await response.json();

  return users || [];
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
    throw new Error(response.message);
  }

  return response.json();
};

export { addAccount, getAllAccounts };
