const getAllAccounts = async (recent = "") => {
  console.trace("Received recent:", recent, "Type:", typeof recent); // Debugging


  if (typeof recent === "object") {
    console.warn(
      "Warning: recent should be a string or number, but got an object.",
    );
    recent = ""; // Prevent issues
  }

  const url = recent
    ? `${import.meta.env.VITE_API_URL}/accounts?recent=${recent}`
    : `${import.meta.env.VITE_API_URL}/accounts`;

  const response = await fetch(url, {
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

const updateAccountRoleType = async (
  accountId,
  roleId,
  grantedPermissions,
  revokedPermissions,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/update-account-role-type/${accountId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleId, grantedPermissions, revokedPermissions }),
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

const resetPassword = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/reset-password`,
    {
      method: "PUT",
      body: formData,
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
  resetPassword,
};
