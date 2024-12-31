import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import KeyOfficial from '../models/KeyOfficial.js';
import AdministartivePosition from "../models/AdministartivePosition.js";
import verifyToken from "../middleware/verifyToken.js"

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage (using memory storage for file handling)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.use(verifyToken)

// POST route to save key official data (including image upload)
router.post('/keyofficials', upload.single('image'), async (req, res) => {
  try {
    const { name, position, campus_id, administrative_position_id } = req.body;

    // Check if the image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).send('Internal Server Error');
      }

      const imageUrl = result.secure_url; // Get the Cloudinary image URL

      // Create a new KeyOfficial document with the image URL
      const newOfficial = new KeyOfficial({
        name,
        administrative_position_id,
        key_official_photo_url: imageUrl,
        campus_id,
        is_deleted: false, // Default to false
      });

      await newOfficial.save();
      res.status(200).json({ message: 'Official saved successfully', data: newOfficial });
    });

    // Create a readable stream for the image buffer (from multer's memory storage)
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null); // End the stream
    bufferStream.pipe(cloudinaryResponse);

  } catch (error) {
    console.error('Error saving official:', error);
    res.status(500).json({ message: 'Error saving official data' });
  }
});

router.get("/keyofficials", async (req, res) => {
    try {
      const keyOfficials = await KeyOfficial.find()
      
        .populate("administrative_position_id", "administartive_position_name") // Populate only the name of the position
        .populate("campus_id"); // Optionally populate campus_id if needed
  
      // Map through the result and send the desired data (name, position name, and photo URL)
      const populatedData = keyOfficials.map(official => ({
        _id: official._id,
        name: official.name,
        position_name: official.administrative_position_id ? official.administrative_position_id.administartive_position_name : '',
        key_official_photo_url: official.key_official_photo_url,
      }));
  
      res.status(200).json(populatedData);
    } catch (error) {
      console.error("Error fetching key officials:", error);
      res.status(500).json({ message: "Error fetching key officials." });
    }
  });

  router.get("/keyofficials/:id", async (req, res) => {
    try {
      const keyOfficials = await KeyOfficial.find()
      
        .populate("administrative_position_id", "administartive_position_name") // Populate only the name of the position
        .populate("campus_id"); // Optionally populate campus_id if needed
  
      // Map through the result and send the desired data (name, position name, and photo URL)
      const populatedData = keyOfficials.map(official => ({
        _id: official._id,
        name: official.name,
        position_name: official.administrative_position_id ? official.administrative_position_id.administartive_position_name : '',
        key_official_photo_url: official.key_official_photo_url,
      }));
  
      res.status(200).json(populatedData);
    } catch (error) {
      console.error("Error fetching key officials:", error);
      res.status(500).json({ message: "Error fetching key officials." });
    }
  });

  router.delete("/keyofficials/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract id from request params
        const deletedOfficial = await KeyOfficial.findByIdAndDelete(id); // Delete by ID
        if (!deletedOfficial) {
            return res.status(404).json({ message: "Key Official not found." });
        }
        res.status(200).json({ message: "Key Official deleted successfully." });
    } catch (error) {
        console.error("Error deleting Key Official:", error);
        res.status(500).json({ message: "Failed to delete Key Official.", error });
    }
});

router.put("/keyofficials/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, administrative_position_id } = req.body;

    const updatedData = { 
      name, 
      administrative_position_id
    };

    // Check if a new image is uploaded
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
      updatedData.key_official_photo_url = cloudinaryResponse.secure_url;
    }

    // Update the Key Official document in MongoDB
    const updatedOfficial = await KeyOfficial.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedOfficial) {
      return res.status(404).json({ message: "Key Official not found" });
    }

    // Fetch the administrative position name
    const position = await AdministartivePosition.findById(administrative_position_id);

    // Add the position name to the response
    const responseOfficial = {
      ...updatedOfficial.toObject(),
      position_name: position ? position.administartive_position_name : "",
    };

    res.status(200).json({
      message: "Key Official updated successfully",
      updatedOfficial: responseOfficial,
    });
  } catch (error) {
    console.error("Error updating Key Official:", error);
    res.status(500).json({ message: "Failed to update Key Official", error });
  }
});

export default router;
