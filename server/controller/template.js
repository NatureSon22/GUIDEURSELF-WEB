import cloudinary from "cloudinary";
import ReportTemplate from "../models/reportTemplate.js";
import fs from "fs";

const postTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let fileUrl;

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "templates",
        resource_type: "auto",
      });
      fileUrl = result.secure_url;
    } catch (uploadError) {
      return res.status(500).json({
        message: "Failed to upload template file to Cloudinary",
        error: uploadError.message,
      });
    }

    const template = new ReportTemplate({
      name: req.file.originalname,
      template_url: fileUrl,
    });

    await template.save();

    res.status(200).json({
      message: "Template added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  } finally {
    fs.unlinkSync(req.file.path);
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
