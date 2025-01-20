import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import fetch from "node-fetch";
import CampusFolderModel from "../models/campusFolder.js";
import DocumentModel from "../models/campusDocument.js";
import UserModel from "../models/user.js";
import uploadToUploadcare from "../config/uploadCare.js";
import fs from "fs/promises";
import { get } from "http";

const getAllFolders = async (req, res) => {
  try {
    const folders = await CampusFolderModel.find();

    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createFolder = async (req, res) => {
  const { name, campus_id } = req.body;

  try {
    const response = await fetch(CODY_URLS.CREATE_FOLDER(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ message: "Failed to create folder", error: errorText });
    }

    const {
      data: { id: folder_id },
    } = await response.json();

    const folder = new CampusFolderModel({
      folder_name: name,
      folder_id,
      campus_id,
    });

    await folder.save();

    return res.status(201).json({
      message: "Folder created successfully",
    });
  } catch (error) {
    console.error("Error creating folder:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  const { folderId } = req.params;

  try {
    const documents = await DocumentModel.find({ folder_id: folderId });

    const enrichedDocuments = await Promise.all(
      documents.map(async (doc) => {
        const publishedByUser = await UserModel.findById(doc.published_by);

        const publishedByName =
          doc.published_by.toString() === req.user.userId
            ? "You"
            : publishedByUser
            ? `${publishedByUser.firstname} ${publishedByUser.lastname}`
            : "Unknown User";

        const contributorNames = await Promise.all(
          doc.contributors.map(async (contributorId) => {
            const contributor = await UserModel.findById(contributorId);
            return contributorId.toString() === req.user.userId
              ? "You"
              : contributor
              ? `${contributor.firstname} ${contributor.lastname}`
              : "Unknown User";
          })
        );

        return {
          ...doc.toObject(),
          published_by: publishedByName,
          contributors: contributorNames,
        };
      })
    );

    res.status(200).json({ documents: enrichedDocuments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await DocumentModel.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const response = await fetch(document.content_url, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ message: "Failed to fetch document", error: errorText });
    }

    const content = await response.text();

    res.status(200).json({ document: { ...document.toObject(), content } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const { name, folder_id, content, visibility } = req.body;

    const response = await fetch(CODY_URLS.CREATE_DOCUMENT(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ name, folder_id, content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ message: "Failed to create document", error: errorText });
    }

    // add a delay to wait for the document to be created
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const {
      data: { content_url, status },
    } = await response.json();

    await DocumentModel.create({
      folder_id,
      file_name: `${name}.txt`,
      published_by: req.user.userId,
      date_and_time: new Date(),
      contributors: [req.user.userId],
      document_type: "created-document",
      content_url,
      date_last_modified: new Date(),
      status,
      visibility,
    });

    return res.status(201).json({
      message: "Document created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to get the signed URL from Cody AI
const getSignedUploadURL = async (file) => {
  const response = await fetch("https://getcody.ai/api/v1/uploads/signed-url", {
    method: "POST",
    headers: {
      ...HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content_type: file.mimetype || "application/octet-stream", // Use file's mime type
      file_name: file.originalname, // File's original name
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get signed upload URL.");
  }

  const {
    data: { key, url },
  } = await response.json();
  return { key, url };
};

// Helper function to upload the file to S3
const uploadFileToS3 = async (url, file) => {
  const fileData = await fs.readFile(file.path);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.mimetype || "application/octet-stream",
    },
    body: fileData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload the file to S3.");
  }
};

// Helper function to create a document in Cody AI
const createCodyDocument = async (folderId, key) => {
  const response = await fetch("https://getcody.ai/api/v1/documents/file", {
    method: "POST",
    headers: {
      ...HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      folder_id: folderId,
      key: key,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create document in Cody AI.");
  }

  const data = await response.json();
  return data;
};

const getFilesFromFolders = async (folder_id) => {
  console.log(folder_id);
  const response = await fetch(CODY_URLS.GET_DOCUMENT(folder_id), {
    method: "GET",
    headers: HEADERS,
  });

  const { data } = await response.json();
  console.log(data);
};

// Main function to handle file uploads and document creation
const uploadFilesAndCreateDocuments = async (req, res) => {
  try {
    const { folder_id, visibility } = req.body;
    const files = req.files;
    const userId = req.user.userId;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided for upload." });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        // Step 1: Get the signed URL
        const { key, url } = await getSignedUploadURL(file);

        // Step 2: Upload the file to S3
        await uploadFileToS3(url, file);

        // Step 3: Create a document in Cody AI
        const document = await createCodyDocument(folder_id, key);

        return {
          file_name: file.originalname,
          document,
        };
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await getFilesFromFolders(folder_id);

    res.status(200).json({
      message: "Files uploaded and documents created successfully.",
      results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  } finally {
    if (req.files) {
      await Promise.all(
        req.files.map(async (file) => {
          try {
            await fs.unlink(file.path);
          } catch (err) {
            console.error(`Error deleting file: ${file.path}`, err.message);
          }
        })
      );
    }
  }
};

const uploadWebPage = async (req, res) => {
  const { folder_id, url, visibility } = req.body;

  try {
    const response = await fetch(CODY_URLS.UPLOAD_WEBPAGE(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        folder_id,
        url,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ message: "Failed to upload webpage", error: errorText });
    }

    // const documents = req.files.map(async (file, index) => {
    //   return DocumentModel.create({
    //     folder_id,
    //     file_name: file.originalname,
    //     published_by: req.user.userId, // this is user
    //     date_and_time: new Date(),
    //     contributors: [req.user.userId], // this is user
    //     document_type: "uploaded-document",
    //     document_url: data[index].file,
    //     content_url: data[index].file,
    //     date_last_modified: new Date(),
    //     status: "published",
    //     visibility,
    //   });
    // });

    // {
    //   "data": {
    //     "id": "string",
    //     "name": "string",
    //     "status": "syncing",
    //     "content_url": "string",
    //     "folder_id": "string",
    //     "created_at": 42
    //   }
    // }

    const {
      data: { status, content_url, name },
    } = await response.json();

    await DocumentModel.create({
      folder_id,
      file_name: name,
      published_by: req.user.userId,
      date_and_time: new Date(),
      contributors: [req.user.userId],
      document_type: "imported-web",
      content_url,
      date_last_modified: new Date(),
      status,
      visibility,
    });

    return res.status(200).json({ message: "Webpage uploaded successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

export {
  getAllFolders,
  createFolder,
  getAllDocuments,
  getDocument,
  createDocument,
  uploadFilesAndCreateDocuments,
  uploadWebPage,
};
