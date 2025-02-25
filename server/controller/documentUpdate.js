import { config } from "dotenv";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import DocumentModel from "../models/campusDocument.js";

config();

const FOLDER_ID = process.env.CODY_FOLDER_ID;

const updateCreatedDocument = async (req, res) => {
  try {
    const { id, name, content, visibility, docId } = req.body;

    await fetch(CODY_URLS.DELETE_DOCUMENT(docId), {
      method: "DELETE",
      headers: HEADERS,
    });

    const response = await fetch(CODY_URLS.CREATE_DOCUMENT(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ name, folder_id: FOLDER_ID, content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: "Failed to edit document.",
        error: errorText,
      });
    }

    const data = await response.json();

    await DocumentModel.findByIdAndUpdate(id, {
      $set: { document_id: data.id, content_url: data.content_url, visibility },
    });

    return res.status(200).json({
      message: "Document updated successfully.",
      document: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
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
