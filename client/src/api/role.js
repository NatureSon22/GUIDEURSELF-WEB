const getAllRoles = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/role-types`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { roleTypes } = await response.json();

  return roleTypes;
};

const addRole = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/role-types/add-role`,
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

export { getAllRoles, addRole };
