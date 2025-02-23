import verifyToken from "../middleware/verifyToken.js";
import GeneralSettings from "../models/generalSetting.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import { Router } from "express";
import activitylog from "../controller/activitylog.js"

// Set up multer for handling image uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

const generalSettingsRouter = Router();

generalSettingsRouter.use(verifyToken);

generalSettingsRouter.get("/get-info", async (req, res) => {
  try {
    const general = await GeneralSettings.find();
    if (!general) {
      return res.status(404).json({ message: "general not found" });
    }
    res.json({ general });
  } catch (error) {
    console.error("Error fetching general data:", error.stack);
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

// Route to fetch university by ID
generalSettingsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const general = await GeneralSettings.findById(id);
    if (!general) {
      return res.status(404).json({ message: "general not found" });
    }
    res.json(general);
  } catch (error) {
    console.error("Error fetching general data:", error.stack);
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

generalSettingsRouter.put(
  "/update/:id",
  upload.single("general_logo_url"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId; 
      
      if (!userId) {
        console.warn("No user ID found in request.");
      }

      const { general_about, privacy_policies, terms_conditions } = req.body;

      const updatedData = {
        general_about,
        privacy_policies,
        terms_conditions,
      };

      // Fetch existing General Settings data
      const existingGeneral = await GeneralSettings.findById(id);
      if (!existingGeneral) {
        return res.status(404).json({ message: "General Settings not found" });
      }

      let changes = [];

      // Check if a new logo is uploaded
      if (req.file) {
        const cloudinaryResponse = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          const bufferStream = new Readable();
          bufferStream.push(req.file.buffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
        });

        updatedData.general_logo_url = cloudinaryResponse.secure_url;
        changes.push("general logo");
      }

      // Compare text fields to detect changes
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] && updatedData[key] !== existingGeneral[key]) {
          changes.push(key.replace(/_/g, " ").replace(/ url/i, "")); // Clean field name
        }
      });

      console.log("Detected Changes:", changes);

      // Update the GeneralSettings document in MongoDB
      const updatedGeneral = await GeneralSettings.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      if (!updatedGeneral) {
        return res.status(404).json({ message: "General Settings not found" });
      }

      // Log changes
      if (userId && changes.length > 0) {
        await activitylog(userId, `Updated the ${changes.join(", ")}`);
      } else {
        console.warn("User ID not found or no changes made, activity log not saved.");
      }

      res.status(200).json({
        message: "General Settings updated successfully",
        updatedGeneral,
      });
    } catch (error) {
      console.error("Error updating General Settings:", error.stack);
      res.status(500).json({
        message: "Failed to update General Settings",
        error: error.message,
      });
    }
  }
);

export default generalSettingsRouter;
