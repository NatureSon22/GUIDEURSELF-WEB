const getAllFolders = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/documents`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { folders } = await response.json();

  return folders || [];
};

const getAllDocuments = async (folder_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/get-all-documents/${folder_id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { documents } = await response.json();
  return documents || [];
};

const getDocument = async (documentId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/get-document/${documentId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { document } = await response.json();
  return document || {};
};

const createDocument = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/create-document`,
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

const createFromUploadDocument = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/upload-document`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();
  return message;
};

const uploadFromWeb = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/upload-web`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message } = await response.json();
  return message;
};

export {
  getAllFolders,
  getAllDocuments,
  getDocument,
  createDocument,
  createFromUploadDocument,
  uploadFromWeb,
};
