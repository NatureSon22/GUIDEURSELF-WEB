import { config } from "dotenv";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import DocumentModel from "../models/campusDocument.js";

config();

const FOLDER_ID = process.env.CODY_FOLDER_ID;

const updateCreatedDocument = async (req, res) => {
  try {
    const { id, name, content, visibility, docId } = req.body;
    const userId = req.user?.userId;

    const requiredFields = [id, name, content, docId];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Delete old document
    const deleteResponse = await fetch(CODY_URLS.DELETE_DOCUMENT(docId), {
      method: "DELETE",
      headers: HEADERS,
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      return res.status(deleteResponse.status).json({
        message: "Failed to delete existing document.",
        error: errorText,
      });
    }
    console.log(`Document deleted successfully: ${docId}`);

    // Create new document
    const createResponse = await fetch(CODY_URLS.CREATE_DOCUMENT(), {
      method: "POST",
      headers: {
        ...HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, folder_id: FOLDER_ID, content }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      return res.status(createResponse.status).json({
        message: "Failed to create new document.",
        error: errorText,
      });
    }

    const { data } = await createResponse.json();

    // Update database
    await DocumentModel.findByIdAndUpdate(id, {
      $set: {
        file_name: name,
        document_id: data.id,
        content_url: data.content_url,
        visibility,
        metadata: {
          content: content,
        },
      },
      $addToSet: { contributors: userId },
    });

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
    const fields = {
      date_last_modified: new Date(),
    };

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
