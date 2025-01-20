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

const addBulkAccount = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/import-add-account`,
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

const updateAccount = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/update-account`,
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

const update = async (data) => {
  const response = await fetch(
    ` ${import.meta.env.VITE_API_URL}/accounts/update-profile`,
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

const updateAccountRoleType = async (accountId, formData) => {
  console.log(formData);
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/update-account-role-type/${accountId}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ roleId: formData }),
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();
  return message;
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

export {
  addAccount,
  addBulkAccount,
  getAccount,
  getAllAccounts,
  updateAccount,
  update,
  updateAccountRoleType,
  verifyAccount,
};
