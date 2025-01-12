import cloudinary from "cloudinary";
import ReportTemplate from "../models/reportTemplate.js";
import fs from "fs";
import { config } from "dotenv";

config();

const postTemplate = async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded" });
    }

    const uploadedFiles = [];

    // Iterate through all uploaded files
    for (const file of req.files) {
      let fileUrl;

      try {
        // Upload each file to Cloudinary
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "templates",
          resource_type: "auto",
        });
        fileUrl = result.secure_url;
      } catch (error) {
        return res.status(500).json({
          message: "Failed to upload template file",
          error: `cloudinary error: ${error.message}`,
        });
      }

      // Save the file details to the database
      const template = new ReportTemplate({
        name: file.originalname,
        template_url: fileUrl,
      });

      await template.save();

      // Add to the response array
      uploadedFiles.push({
        name: file.originalname,
        url: fileUrl,
      });
    }

    // Return success response
    return res.status(200).json({
      message: "Templates added successfully",
      uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  } finally {
    // Optionally delete uploaded files from the server
    for (const file of req.files || []) {
      fs.unlinkSync(file.path);
    }
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await ReportTemplate.find();
    res.status(200).json({ templates });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { postTemplate, getTemplates };
