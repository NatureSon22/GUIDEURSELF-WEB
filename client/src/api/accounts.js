const getAllAccounts = async (recent = "", filterRoles = []) => {
  const roleParams = filterRoles.length
    ? `&roles=${filterRoles.join(",")}`
    : "";
  console.log(roleParams);
  const url = `${import.meta.env.VITE_API_URL}/accounts?recent=${recent}${roleParams}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => ({
      message: "Unknown error occurred.",
    }));
    throw new Error(errorResponse.message || "Failed to fetch accounts.");
  }

  const { users } = await response.json();

  return (users || []).sort((a, b) => {
    const dateA = new Date(a.createdAt || "1970-01-01");
    const dateB = new Date(b.createdAt || "1970-01-01");
    return dateB - dateA;
  });
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

const getAllInactiveAccount = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/inactive-accounts`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
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

const verifyAccount = async (accountIds) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/verify-account`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountIds }),
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

const activateAccount = async (accountId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/activate-account/${accountId}`,
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

const deleteAccount = async (accountIds) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/delete-accounts`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountIds }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete accounts");
  }

  return data.message;
};

const archiveAccount = async (accountIds) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/accounts/archive-accounts`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountIds }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to archive accounts");
  }

  return data.message;
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
  getAllInactiveAccount,
  activateAccount,
  deleteAccount,
  archiveAccount,
};
