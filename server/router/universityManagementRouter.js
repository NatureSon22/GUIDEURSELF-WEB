import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import University from "../models/university.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";

// Set up multer for handling image uploads
const upload = multer();

const universityManagementRouter = express.Router();

// Apply token verification middleware to all routes in this router
universityManagementRouter.use(verifyToken);

// Route to fetch university by ID
universityManagementRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }
    res.json(university);
  } catch (error) {
    console.error("Error fetching university data:", error);
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

// Route to update the university details (including logo and vector image)
universityManagementRouter.put("/:id", upload.fields([{ name: "university_logo_url", maxCount: 1 }, { name: "university_vector_url", maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { university_history, university_vision, university_mission, university_core_values } = req.body;

  const updatedData = {
    university_history,
    university_vision,
    university_mission,
    university_core_values,
  };

  try {
    // Check if a new logo image is uploaded
    if (req.files && req.files.university_logo_url) {
      const cloudinaryLogoResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(req.files.university_logo_url[0].buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });

      updatedData.university_logo_url = cloudinaryLogoResponse.secure_url;
    }

    // Check if a new vector image is uploaded
    if (req.files && req.files.university_vector_url) {
      const cloudinaryVectorResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(req.files.university_vector_url[0].buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });

      updatedData.university_vector_url = cloudinaryVectorResponse.secure_url;
    }

    // Update the university document in MongoDB
    const updatedUniversity = await University.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUniversity) {
      return res.status(404).json({ message: "University not found" });
    }

    res.status(200).json({
      message: "University details updated successfully",
      updatedUniversity,
    });
  } catch (error) {
    console.error("Error updating university details:", error);
    res.status(500).json({ message: "Failed to update university details", error });
  }
});


export default universityManagementRouter;
