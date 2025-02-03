import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import { KeyOfficial, ArchivedKeyOfficial } from "../models/KeyOfficial.js"; 
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
    // Fetch all key officials without populating any fields
    const keyOfficials = await KeyOfficial.find();

    // Return the data as is
    res.status(200).json(keyOfficials);
  } catch (error) {
    console.error("Error fetching key officials:", error);
    res.status(500).json({ message: "Error fetching key officials." });
  }
});


router.post("/unarchive/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find the archived key official by ID
    const archivedOfficial = await ArchivedKeyOfficial.findById(id);

    if (!archivedOfficial) {
      return res.status(404).json({ message: "Archived key official not found" });
    }

    // Step 2: Insert the archived data into the KeyOfficial collection
    const newKeyOfficial = new KeyOfficial({
      position_name: archivedOfficial.position_name,
      name: archivedOfficial.name,
      key_official_photo_url: archivedOfficial.key_official_photo_url,
      campus_id: archivedOfficial.campus_id,
      date_added: new Date(),
    });

    await newKeyOfficial.save();

    // Step 3: Delete the data from the ArchivedKeyOfficial collection
    await ArchivedKeyOfficial.findByIdAndDelete(id);

    // Respond with success message
    res.status(200).json({
      message: "Key official unarchived successfully",
      data: newKeyOfficial,
    });
  } catch (error) {
    console.error("Error unarchiving key official:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/archived", async (req, res) => {
  try {
    const archivedOfficials = await ArchivedKeyOfficial.find();
    res.status(200).json(archivedOfficials);
  } catch (error) {
    console.error("Error fetching archived key officials:", error); // Log the error
    res.status(500).json({ message: "Error fetching key official.", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch a single key official by ID without populating any fields
    const keyOfficial = await KeyOfficial.findById(id);

    if (!keyOfficial) {
      return res.status(404).json({ message: "Key official not found." });
    }

    // Return the data as is
    res.status(200).json(keyOfficial);
  } catch (error) {
    console.error("Error fetching key official:", error);
    res.status(500).json({ message: "Error fetching key official." });
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


router.post('/archive/:id', async (req, res) => {
  const officialId = req.params.id;

  try {
    // Find the official to be archived by its ID
    const official = await KeyOfficial.findById(officialId);

    if (!official) {
      return res.status(404).json({ message: 'Key Official not found' });
    }

    // Archive the official by copying the data to ArchiveKeyOfficial
    const archivedOfficial = new ArchivedKeyOfficial({
      _id: official._id,
      position_name: official.position_name,
      name: official.name,
      key_official_photo_url: official.key_official_photo_url,
      campus_id: official.campus_id,
      date_added: new Date(),
    });

    // Save the archived official
    await archivedOfficial.save();

    // Optionally, you may delete the official from the original collection if needed
    await KeyOfficial.findByIdAndDelete(officialId);

    res.status(200).json({ message: 'Key Official archived successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while archiving the key official' });
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
