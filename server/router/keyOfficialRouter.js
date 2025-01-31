import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import KeyOfficial from '../models/KeyOfficial.js';
import AdministartivePosition from "../models/AdministartivePosition.js";
import verifyToken from "../middleware/verifyToken.js"

// Set up multer storage (using memory storage for file handling)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.use(verifyToken)

// POST route to save key official data (including image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position, campus_id, position_name } = req.body;

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
        position_name,
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

router.get("/", async (req, res) => {
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

  router.get("/:id", async (req, res) => {
    try {
      const keyOfficials = await KeyOfficial.find()
        .populate("administrative_position_id", "administartive_position_name") // Populate position name
        .populate("campus_id"); // Optionally populate campus_id if needed
  
      // Map through the result and send the desired data
      const populatedData = keyOfficials.map((official) => ({
        _id: official._id,
        name: official.name,
        position_name: official.administrative_position_id
          ? official.administrative_position_id.administartive_position_name
          : '',
        key_official_photo_url: official.key_official_photo_url,
      }));
  
      res.status(200).json(populatedData); // Send the response with populated data
    } catch (error) {
      console.error("Error fetching key officials:", error);
      res.status(500).json({ message: "Error fetching key officials." });
    }
  });
  

  router.delete("/:id", async (req, res) => {
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

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position_name } = req.body;

    // Prepare the update object
    const updatedData = { name, position_name };

    // Check if an image was uploaded
    if (req.file) {
      try {
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(req.file.path, {
          resource_type: "image",
        });

        updatedData.key_official_photo_url = cloudinaryResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    // Update Key Official
    const updatedOfficial = await KeyOfficial.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedOfficial) {
      return res.status(404).json({ message: "Key Official not found" });
    }

    res.status(200).json({
      message: "Key Official updated successfully",
      updatedOfficial,
    });
  } catch (error) {
    console.error("Error updating Key Official:", error);
    res.status(500).json({ message: "Failed to update Key Official", error: error.message });
  }
});

export default router;
