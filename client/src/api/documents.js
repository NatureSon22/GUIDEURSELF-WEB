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

const getAllDocuments = async (
  folder_id = "",
  type = "",
  draftsOnly = false,
  recent = false,
  is_deleted = false,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/get-all-documents/${folder_id}?type=${type}&draftsOnly=${draftsOnly}&recent=${recent}&is_deleted=${is_deleted}`,
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

// Create Operations
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

const saveAsDraft = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/create-draft`,
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

  return await response.json();
};

// Upload Operations
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

const uploadDraftDocument = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/upload-draft-document`,
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

const saveAsDraftDocument = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/create-draft-document`,
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

const saveAsDraftWeb = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/create-draft-web`,
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

const syncDraftDocument = async (documentId) => {
  await fetch(
    `${import.meta.env.VITE_API_URL}/documents/sync-draft/${documentId}`,
    {
      method: "PUT",
      credentials: "include",
    },
  );
};

const deleteDocument = async (documentId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/delete-document/${documentId}`,
    {
      method: "DELETE",
      credentials: "include",
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
  uploadDraftDocument,
  uploadFromWeb,
  saveAsDraftWeb,
  saveAsDraft,
  saveAsDraftDocument,
  syncDraftDocument,
  deleteDocument,
};
