import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import { KeyOfficial, ArchivedKeyOfficial } from "../models/KeyOfficial.js"; 
import verifyToken from "../middleware/verifyToken.js"
import activitylog from "../controller/activitylog.js"

// Set up multer storage (using memory storage for file handling)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.use(verifyToken)

// POST route to save key official data (including image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position_name, campus_id } = req.body;
    const userId = req.user?.userId; 

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });

    const imageUrl = cloudinaryResponse.secure_url;

    // Save the new KeyOfficial
    const newOfficial = new KeyOfficial({
      name,
      position_name,
      key_official_photo_url: imageUrl,
      campus_id,
      is_deleted: false,
    });

    await newOfficial.save();

    // **Ensure activity log is properly saved**
    if (userId) {
      await activitylog(userId, `Added key official: ${name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    res.status(200).json({ message: "Official saved successfully", data: newOfficial });
  } catch (error) {
    console.error("Error saving official:", error);
    res.status(500).json({ message: "Error saving official data" });
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
  const userId = req.user?.userId; 

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

    
   if (userId) {
    await activitylog(userId, `Retrieved key official: ${archivedOfficial.name}`);
  } else {
    console.warn("User ID not found, activity log not saved.");
  }

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

router.post("/archive/:id", async (req, res) => {
  const officialId = req.params.id;
  const userId = req.user?.userId; 

  try {
    // Find the official to be archived
    const official = await KeyOfficial.findById(officialId);
    if (!official) {
      return res.status(404).json({ message: "Key Official not found" });
    }

    // Archive the official by copying data to ArchivedKeyOfficial
    const archivedOfficial = new ArchivedKeyOfficial({
      _id: official._id,
      position_name: official.position_name,
      name: official.name,
      key_official_photo_url: official.key_official_photo_url,
      campus_id: official.campus_id,
      date_added: new Date(),
    });

    await archivedOfficial.save();
    await KeyOfficial.findByIdAndDelete(officialId);

    // **Ensure activity log is properly saved**
    if (userId) {
      await activitylog(userId, `Archived key official: ${official.name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    res.status(200).json({ message: "Key Official archived successfully" });
  } catch (error) {
    console.error("Error archiving key official:", error);
    res.status(500).json({ message: "An error occurred while archiving the key official" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position_name } = req.body;  
    const userId = req.user?.userId; 

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

    
    // **Ensure activity log is properly saved**
    if (userId) {
      await activitylog(userId, `Updated key official: ${updatedData.name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

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
