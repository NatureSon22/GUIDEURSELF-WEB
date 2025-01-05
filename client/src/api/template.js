const getTemplates = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/templates`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }

  const { templates } = await response.json();

  return templates || [];
};

const postTemplate = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/templates/upload-template`,
    {
      method: "POST",
      credentials: "include",
      body: data,
    },
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }

  return response.json();
};

export { getTemplates, postTemplate };
