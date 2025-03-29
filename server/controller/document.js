import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import fetch from "node-fetch";
import CampusFolderModel from "../models/campusFolder.js";
import DocumentModel from "../models/campusDocument.js";
import UserModel from "../models/user.js";
import uploadToUploadcare from "../config/uploadCare.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";
import documentParser from "./documentParser.js";
import activitylog from "./activitylog.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FOLDER_ID = process.env.CODY_FOLDER_ID;

// Helper Functions
const getSignedUploadURL = async (file) => {
  const response = await fetch("https://getcody.ai/api/v1/uploads/signed-url", {
    method: "POST",
    headers: {
      ...HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content_type: file.mimetype || "application/octet-stream",
      file_name: file.originalname,
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

const createCodyDocument = async (key) => {
  try {
    const response = await fetch("https://getcody.ai/api/v1/documents/file", {
      method: "POST",
      headers: {
        ...HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folder_id: FOLDER_ID, // Ensure using parameter, not undefined variable
        key: key,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Capture response body for debugging
      console.error(`Error: ${response.status} - ${response.statusText}`);
      console.error(`Response Body: ${errorBody}`);
      throw new Error(
        `Failed to create document in Cody AI: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error.message);
    throw error;
  }
};

const getWebPageTitle = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title =
      doc.querySelector("title")?.textContent || "Untitled Document";
    return title;
  } catch (error) {
    console.error("Error fetching title:", error);
    return "Untitled Document"; // Default fallback in case of an error
  }
};

// Folder Operations
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

// Document Retrieval Operations
const getAllDocuments = async (req, res) => {
  try {
    const { type, draftsOnly, recent, is_deleted, all } = req.query;
    const isDraftOnly = draftsOnly === "true";
    const isDeleted = is_deleted === "true";
    const isRecent = recent === "true";

    // Build query parameters
    let params = {
      is_deleted: isDeleted ? true : { $ne: true },
    };

    // Ensure drafts are only accessible to the publisher
    if (isDraftOnly) {
      params.type = "draft";
      params.published_by = req.user?.userId; // Only show drafts owned by the current user
    } else {
      // If `all` is false, apply the type filter
      if (!all) {
        params.type = type || { $ne: "draft" };
      }

      // Ensure "onlyMe" documents are only accessible to contributors
      if (req.user?.userId) {
        params.$or = [
          { visibility: { $ne: "onlyMe" } }, // Public or restricted visibility
          { contributors: req.user.userId }, // User is a contributor
        ];
      }
    }

    // Sorting configuration
    const sortQuery = isRecent ? { date_and_time: -1 } : {};

    // Fetch documents
    const documents = await DocumentModel.find(params)
      .sort(sortQuery)
      .populate("campus_id", "campus_name");

    // Collect user IDs for enrichment
    const userIds = new Set();
    documents.forEach((doc) => {
      if (doc.published_by) userIds.add(doc.published_by.toString());
      doc.contributors?.forEach((id) => userIds.add(id.toString()));
    });

    // Fetch user details and map by ID
    const users = await UserModel.find({ _id: { $in: Array.from(userIds) } });

    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Enrich document data
    const enrichedDocuments = documents.map((doc) => {
      const publishedByUser = userMap.get(doc.published_by?.toString());
      const contributorUsers = (doc.contributors || []).map((id) =>
        userMap.get(id.toString())
      );

      return {
        ...doc.toObject(),
        published_by:
          publishedByUser?.id?.toString() === req.user?.userId
            ? "You"
            : `${publishedByUser?.firstname || "Unknown"} ${
                publishedByUser?.lastname || ""
              }`.trim(),
        contributors: contributorUsers
          .map((contributor) =>
            contributor?.id?.toString() === req.user?.userId
              ? "You"
              : `${contributor?.lastname || ""}`.trim()
          )
          .join(", "),
      };
    });

    res.status(200).json({
      documents: enrichedDocuments,
    });
  } catch (error) {
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production" ? "Server error" : error.message,
      error: error.stack,
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await DocumentModel.findById(documentId);
    let content = "";

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document?.content_url) {
      const contentUrl = document.content_url.trim();
      if (!contentUrl) {
        return res.status(400).json({ message: "Invalid content URL" });
      }

      const response = await fetch(contentUrl, {
        method: "GET",
        headers: HEADERS,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          message: "Failed to fetch document content",
          error: errorText,
        });
      }

      content = await response.text();
    }

    res.status(200).json({
      document: {
        ...document.toObject(),
        content: content,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Document Creation Operations
// Document Creation Operations
const createDocument = async (req, res) => {
  try {
    const { name, content, visibility, documentId, isdraft } = req.body;
    const isDraft = isdraft === "true" || isdraft === true;

    // if (!name || !content || !visibility) {
    //   return res.status(400).json({
    //     message: "Missing required fields: name, content, or visibility",
    //   });
    // }

    if (isDraft && documentId) {
      const draftUpdate = await DocumentModel.updateOne(
        { _id: documentId },
        {
          $set: {
            date_last_modified: new Date(),
            is_deleted: false,
          },
        }
      );

      if (!draftUpdate.modifiedCount) {
        return res
          .status(404)
          .json({ message: "Draft document not found for update" });
      }

      return res.status(201).json({
        message: "Document archived successfully",
      });
    }

    const response = await fetch(CODY_URLS.CREATE_DOCUMENT(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ name, folder_id: FOLDER_ID, content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: "Failed to create document",
        error: errorText,
      });
    }

    //await new Promise((resolve) => setTimeout(resolve, 2000));

    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      return res.status(500).json({
        message: "Failed to parse response",
        error: error.message,
      });
    }

    const { content_url, status, id } = responseData.data || {};

    if (!content_url) {
      return res.status(500).json({
        message: "Content URL is missing in the response",
      });
    }

    if (documentId) {
      const updateData = {
        content_url,
        date_last_modified: new Date(),
        visibility,
        type: "published",
        status: "synced",
      };

      if (id) {
        updateData.document_id = id;
        updateData.is_deleted = false;
      }

      const updateResult = await DocumentModel.updateOne(
        { _id: documentId },
        { $set: updateData }
      );

      if (!updateResult.modifiedCount) {
        return res
          .status(404)
          .json({ message: "Document not found for update" });
      }
    } else {
      await DocumentModel.create({
        campus_id: req.user.campusId,
        file_name: `${name}`,
        published_by: req.user.userId,
        date_and_time: new Date(),
        contributors: [req.user.userId],
        document_type: "created-document",
        content_url,
        document_id: id,
        date_last_modified: new Date(),
        status: "synced",
        type: "published",
        visibility,
        metadata: {
          content: content,
        },
      });

      activitylog(req.user.userId, "Created document");
    }

    return res.status(201).json({
      message: "Document created successfully",
    });
  } catch (error) {
    console.error("Error in createDocument:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const saveAsDraftCreatedDocument = async (req, res) => {
  let filePath = null;

  try {
    const { name, content, visibility, documentId } = req.body;

    if (!name || !content) {
      return res
        .status(400)
        .json({ message: "Both 'name' and 'content' are required." });
    }

    const uploadsDir = path.resolve(__dirname, "../uploads/document");
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${name.replace(/[^a-z0-9]/gi, "_")}.txt`; // Sanitize name
    filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, content);

    const metadata = {
      name,
      content,
      visibility,
    };

    if (documentId) {
      const result = await DocumentModel.updateOne(
        { _id: documentId },
        {
          $set: {
            visibility,
            file_name: fileName,
            metadata,
            date_last_modified: new Date(),
          },
        }
      );

      if (result.nModified === 0) {
        return res.status(404).json({ message: "Document not found." });
      }
    } else {
      await DocumentModel.create({
        campus_id: req.user.campusId,
        file_name: fileName,
        published_by: req.user.userId,
        date_and_time: new Date(),
        contributors: [req.user.userId],
        document_type: "created-document",
        date_last_modified: new Date(),
        status: "unparsed",
        type: "draft",
        visibility,
        metadata,
      });
    }

    res.status(200).json({
      message: "Draft saved successfully.",
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({
      message: "An error occurred while saving the draft.",
      error: error.message,
    });
  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }
  }
};

const getContentURL = async (filename) => {
  try {
    const alldocuments = await fetch(CODY_URLS.LIST_DOCUMENT(), {
      method: "GET",
      headers: HEADERS,
    });

    const { data } = await alldocuments.json();

    const doc = data.find((doc) => doc.name === filename);
    console.log(doc);

    return doc ? { content_url: doc.content_url, id: doc.id } : {};
  } catch (error) {
    throw new Error(error);
  }
};

// File Upload Operations
const uploadFilesAndCreateDocuments = async (req, res) => {
  try {
    const { visibility } = req.body;
    const files = req.files;
    const userId = req.user.userId;

    if (!files?.length) {
      return res.status(400).json({ message: "No files provided for upload." });
    }

    const results = await Promise.allSettled(
      files.map(async (file) => {
        try {
          // Upload to Uploadcare
          const uploadcareResponse = await uploadToUploadcare(file.path);
          if (uploadcareResponse.error) {
            throw new Error(
              `Uploadcare upload failed: ${uploadcareResponse.error}`
            );
          }

          // Get signed URL and upload to S3
          const { key, url } = await getSignedUploadURL(file);
          await uploadFileToS3(url, file);

          // Create document
          const document = await createCodyDocument(key);

          // Parse content
          const contentResponse = await documentParser(file.path, false);
          if (!contentResponse?.length) {
            throw new Error("Document parsing failed - no content extracted");
          }

          const content = contentResponse.map((item) => item.text).join("\n");
          const docData = await getContentURL(file.originalname);

          return {
            success: true,
            data: {
              file_name: file.originalname,
              document,
              content,
              docData,
              documentUrl: uploadcareResponse.cdnUrl,
            },
          };
        } catch (error) {
          return {
            success: false,
            file: file.originalname,
            error: error.message,
          };
        }
      })
    );

    // Process results
    const successfulUploads = [];
    const failedUploads = [];

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successfulUploads.push(result.value.data);
      } else if (result.status === "fulfilled" && !result.value.success) {
        failedUploads.push(result.value);
      } else {
        failedUploads.push({
          file: "Unknown",
          error: result.reason?.message || "Unknown error",
        });
      }
    });

    if (successfulUploads.length) {
      await Promise.all(
        successfulUploads.map(
          ({ file_name, document, content, docData, documentUrl }) =>
            DocumentModel.create({
              campus_id: req.user.campusId,
              file_name,
              document_id: docData?.id || "",
              published_by: userId,
              date_and_time: new Date(),
              content_url: docData?.content_url || "",
              document_url: documentUrl,
              contributors: [userId],
              document_type: "uploaded-document",
              date_last_modified: new Date(),
              status: "synced",
              type: "published",
              visibility,
              metadata: { content, file_name },
            })
        )
      );
    }

    // Send appropriate response
    if (failedUploads.length === 0) {
      res.status(200).json({
        message: "All files uploaded and documents created successfully.",
        successCount: successfulUploads.length,
      });
    } else if (successfulUploads.length === 0) {
      res.status(500).json({
        message: "All uploads failed.",
        failures: failedUploads,
      });
    } else {
      res.status(207).json({
        message: "Some uploads succeeded, some failed.",
        successCount: successfulUploads.length,
        failures: failedUploads,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error occurred during upload process.",
      error: error.message,
    });
  } finally {
    if (req.files?.length) {
      await Promise.all(
        req.files.map((file) =>
          fs
            .unlink(file.path)
            .catch((err) =>
              console.error(`Error deleting temporary file ${file.path}:`, err)
            )
        )
      );
    }
  }
};

const uploadDraftFilesAndCreateDocuments = async (req, res) => {
  try {
    const { document_url, visibility, documentId, file_name, isdraft } =
      req.body;
    const isDraft = isdraft === "true" || isdraft === true;
    const file = req.files?.[0];

    if (!isDraft && !file) {
      return res.status(400).json({ message: "No file provided for upload." });
    }

    // Ensure that document_url and documentId are provided
    if ((!isDraft && !document_url) || !documentId) {
      return res.status(400).json({
        message: "document_url and documentId are required.",
      });
    }

    if (!documentId) {
      return res.status(400).json({
        message: "document_url and documentId are required.",
      });
    }

    if (!isDraft && !document_url) {
      return res.status(400).json({
        message: "document_url is required.",
      });
    }

    if (!isDraft) {
      const { key, url } = await getSignedUploadURL(file);
      await uploadFileToS3(url, file);

      const document = await createCodyDocument(key);

      const contentResponse = await documentParser(file.path, false);
      if (!contentResponse?.length) {
        throw new Error("Document parsing failed - no content extracted");
      }

      const content = contentResponse.map((item) => item.text).join("\n");

      const metadata = {
        url: document_url,
        visibility,
        content,
        file_name: file.originalname,
      };

      await DocumentModel.updateOne(
        { _id: documentId },
        {
          $set: {
            metadata,
            content_url: document.content_url,
            document_id: document.id,
            status: "synced",
            type: "published",
            date_last_modified: new Date(),
            is_deleted: false,
            visibility,
          },
        }
      );
    } else {
      await DocumentModel.updateOne(
        { _id: documentId },
        {
          $set: {
            date_last_modified: new Date(),
            is_deleted: false,
          },
        }
      );
    }

    return res.status(200).json({ message: "Document uploaded successfully." });
  } catch (error) {
    console.error("Error in uploadDraftFilesAndCreateDocuments:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

const saveAsDraftUploadDocuments = async (req, res) => {
  try {
    const { visibility } = req.body;
    const files = req.files;
    const userId = req.user.userId;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided for upload." });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const response = await uploadToUploadcare(file.path);

          if (response.error) {
            throw new Error("Failed to upload file.");
          }

          return {
            file_name: file.originalname,
            file_url: response.cdnUrl,
          };
        } catch (error) {
          throw new Error(`Failed to upload ${file.originalname}`);
        }
      })
    );

    await Promise.all(
      results.map(async ({ file_name, file_url }) => {
        await DocumentModel.create({
          campus_id: req.user.campusId,
          file_name,
          document_url: file_url,
          published_by: userId,
          date_and_time: new Date(),
          contributors: [userId],
          document_type: "uploaded-document",
          date_last_modified: new Date(),
          status: "unparsed",
          type: "draft",
          visibility,
        });
      })
    );

    res.status(200).json({
      message: "Files uploaded and documents saved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error occurred",
      error: error.message,
    });
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
  try {
    const { title, url, visibility, documentId, isdraft } = req.body;
    const isDraft = isdraft === "true" || isdraft === true;

    if (!url && !isDraft) {
      return res
        .status(400)
        .json({ message: "URL is required for non-draft documents" });
    }

    if (isDraft) {
      if (!documentId) {
        return res
          .status(400)
          .json({ message: "Document ID is required for draft updates" });
      }

      const result = await DocumentModel.updateOne(
        { _id: documentId },
        {
          $set: {
            is_deleted: false,
            date_last_modified: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Draft document not found" });
      }

      return res
        .status(200)
        .json({ message: "Document unarchived successfully" });
    }

    const uploadResponse = await fetch(CODY_URLS.UPLOAD_WEBPAGE(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        folder_id: FOLDER_ID,
        url,
      }),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();

      return res.status(uploadResponse.status).json({
        message: "Failed to upload webpage. Please try again later.",
        error: errorText,
      });
    }

    const {
      data: { content_url, name, id },
    } = await uploadResponse.json();

    const metadata = {
      url,
      visibility,
    };

    const documentData = {
      file_name: title || name,
      metadata,
      content_url,
      document_id: id,
      status: "synced",
      type: "published",
      date_last_modified: new Date(),
      visibility,
    };

    if (documentId) {
      const result = await DocumentModel.updateOne(
        { _id: documentId },
        { $set: documentData }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Document not found" });
      }
    } else {
      await DocumentModel.create({
        ...documentData,
        campus_id: req.user.campusId,
        published_by: req.user.userId,
        date_and_time: new Date(),
        contributors: [req.user.userId],
        document_type: "imported-web",
        document_url: url,
      });
    }

    return res.status(200).json({ message: "Webpage uploaded successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error occurred",
    });
  }
};

const saveAsDraftUploadWebPage = async (req, res) => {
  const { title, url, author, visibility, documentId } = req.body;

  const metadata = {
    title,
    url,
    author,
    visibility,
  };

  try {
    if (documentId) {
      const result = await DocumentModel.updateOne(
        { _id: documentId },
        {
          $set: {
            file_name: title,
            metadata,
            date_last_modified: new Date(),
          },
        }
      );

      if (result.nModified === 0) {
        return res.status(404).json({ message: "Document not found." });
      }

      return res
        .status(200)
        .json({ message: "Document updated successfully." });
    } else {
      await DocumentModel.create({
        campus_id: req.user.campusId,
        file_name: title || "Untitled",
        published_by: req.user.userId,
        date_and_time: new Date(),
        contributors: [req.user.userId],
        document_type: "imported-web",
        document_url: url,
        date_last_modified: new Date(),
        status: "unparsed",
        type: "draft",
        visibility,
        metadata,
      });

      return res.status(200).json({ message: "Draft saved successfully." });
    }
  } catch (error) {
    console.error("Error saving draft:", error); // Logging for debugging
    return res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

const syncDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    console.log("DocumentID " + documentId);

    // Fetch the document from the database
    const existingDoc = await DocumentModel.findById(documentId);
    if (!existingDoc) {
      return res.status(404).json({ error: "Document not found in database." });
    }

    // Fetch the document's content URL from external API
    const updatedDoc = await getContentURL(existingDoc.file_name);
    if (!updatedDoc) {
      return res.status(404).json({ error: "Document not found in API." });
    }

    // Update database with new document URL
    await DocumentModel.updateOne(
      { _id: documentId },
      {
        $set: {
          document_id: updatedDoc.id,
          content_url: updatedDoc.content_url,
        },
      }
    );

    return res.status(200).json({ message: "Document synced successfully." });
  } catch (error) {
    console.error("Error syncing document:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const doc = await DocumentModel.findById(documentId);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const isDraft = doc.type === "draft";
    let docId = doc.document_id;

    if (!isDraft && !docId) {
      try {
        const document = await getContentURL(doc.file_name);
        const metadataDocument = await getContentURL(doc.metadata?.file_name);

        docId = document?.id || metadataDocument?.id;

        if (!docId) {
          return res
            .status(400)
            .json({ message: "Failed to retrieve document ID" });
        }
      } catch (error) {
        return res.status(500).json({
          message: "Error fetching document ID",
          error: error.message,
        });
      }
    }

    if (docId) {
      try {
        const response = await fetch(CODY_URLS.DELETE_DOCUMENT(docId), {
          method: "DELETE",
          headers: HEADERS,
        });

        if (!response.ok) {
          const errorText = await response.text();
          return res.status(response.status).json({
            message: "Failed to delete document from external service",
            error: errorText || response.statusText,
          });
        }
      } catch (apiError) {
        return res.status(500).json({
          message: "Error contacting external service",
          error: apiError.message,
        });
      }
    }

    doc.is_deleted = true;
    doc.document_id = "";
    await doc.save();

    return res.status(200).json({
      message: "Document deleted successfully.",
      deletedDocument: doc.toObject(),
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteDocuments = async (req, res) => {
  try {
    const { documentIds } = req.body;
    if (
      !documentIds ||
      !Array.isArray(documentIds) ||
      documentIds.length === 0
    ) {
      return res.status(400).json({ message: "Invalid document IDs" });
    }

    await DocumentModel.deleteMany({ _id: { $in: documentIds } });

    res.json({
      message: "Document deletion process completed",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
  uploadDraftFilesAndCreateDocuments,
  saveAsDraftCreatedDocument,
  saveAsDraftUploadWebPage,
  saveAsDraftUploadDocuments,
  syncDocument,
  deleteDocument,
  deleteDocuments,
};
