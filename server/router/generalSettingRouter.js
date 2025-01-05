import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import GeneralSettings from "../models/generalSetting.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";

// Set up multer for handling image uploads
const upload = multer();

const generalSettingsRouter = express.Router();

// Apply token verification middleware to all routes in this router
generalSettingsRouter.use(verifyToken);

// Route to fetch university by ID
generalSettingsRouter.get("/general/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const general = await GeneralSettings.findById(id);
    if (!general) {
      return res.status(404).json({ message: "general not found" });
    }
    res.json(general);
  } catch (error) {
    console.error("Error fetching general data:", error);
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

generalSettingsRouter.put("/general/:id", upload.single("general_logo_url"), async (req, res) => {
    try {
      const { id } = req.params;
      const { general_about, privacy_policies, terms_conditions } = req.body;
  
      const updatedData = {
        general_about,
        privacy_policies,
        terms_conditions,
      };
  
      // Check if a new logo is uploaded
      if (req.file) {
        // Upload image to Cloudinary
        const cloudinaryResponse = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
  
          // Pipe the image buffer to Cloudinary
          const bufferStream = new Readable();
          bufferStream.push(req.file.buffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
        });
  
        // Add the new image URL to updatedData
        updatedData.general_logo_url = cloudinaryResponse.secure_url;
      }
  
      // Update the GeneralSettings document in MongoDB
      const updatedGeneral = await GeneralSettings.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedGeneral) {
        return res.status(404).json({ message: "General Settings not found" });
      }
  
      res.status(200).json({
        message: "General Settings updated successfully",
        updatedGeneral,
      });
    } catch (error) {
      console.error("Error updating General Settings:", error);
      res.status(500).json({ message: "Failed to update General Settings", error });
    }
  });

export default generalSettingsRouter;
