import { config } from "dotenv";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import DocumentModel from "../models/campusDocument.js";

config();

const FOLDER_ID = process.env.CODY_FOLDER_ID;

const updateCreatedDocument = async (req, res) => {
  try {
    const { id, name, content, visibility, docId } = req.body;
    const userId = req.user?.userId;

    // if name and visibility are only provided, then immeditaely update the database
    if (!id || !name || !content || !docId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Step 1: Delete the existing document
    try {
      const deleteResponse = await fetch(CODY_URLS.DELETE_DOCUMENT(docId), {
        method: "DELETE",
        headers: HEADERS,
      });

      if (!deleteResponse.ok) {
        return res.status(deleteResponse.status).json({
          message: "Failed to delete existing document.",
          error: await deleteResponse.text(),
        });
      }

      console.log(`Document deleted successfully: ${docId})`);
    } catch (deleteError) {
      return res.status(500).json({
        message: "Error deleting document.",
        error: deleteError.message,
      });
    }

    // Step 2: Create a new document
    let createResponse;
    try {
      createResponse = await fetch(CODY_URLS.CREATE_DOCUMENT(), {
        method: "POST",
        headers: {
          ...HEADERS,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, folder_id: FOLDER_ID, content }),
      });

      if (!createResponse.ok) {
        return res.status(createResponse.status).json({
          message: "Failed to create new document.",
          error: await createResponse.text(),
        });
      }
    } catch (createError) {
      return res.status(500).json({
        message: "Error creating document.",
        error: createError.message,
      });
    }

    const data = await createResponse.json();

    // Step 3: Update database with the new document details
    try {
      await DocumentModel.findByIdAndUpdate(id, {
        $set: {
          file_name: name,
          document_id: data.id,
          content_url: data.content_url,
          visibility,
        },
        $addToSet: { contributors: userId },
      });
    } catch (dbError) {
      return res
        .status(500)
        .json({ message: "Error updating database.", error: dbError.message });
    }

    return res.status(200).json({
      message: "Document updated successfully.",
      document: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error occurred.",
    });
  }
};

const updateUploadDocument = async (req, res) => {
  try {
    const { documentId, visibility } = req.body;

    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      documentId,
      { visibility },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found." });
    }

    return res.status(200).json({
      message: "Document updated successfully.",
      document: updatedDocument,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

const updateWebUpload = async (req, res) => {
  try {
    const { id, title, visibility } = req.body;
    const fields = {};

    if (title) fields.file_name = title;
    if (visibility) fields.visibility = visibility;

    await DocumentModel.findByIdAndUpdate(id, {
      $set: fields,
    });

    return res.status(200).json({
      message: "Document updated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

export { updateCreatedDocument, updateUploadDocument, updateWebUpload };
