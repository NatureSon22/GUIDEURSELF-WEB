import express from "express";
import Campus from "../models/campusModel.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import verifyToken from "../middleware/verifyToken.js";
import e from "express";

const router = express.Router();
router.use(verifyToken);

// Multer storage (temporary in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Campus
router.post(
  "/campuses",
  upload.single("campus_cover_photo"),
  async (req, res) => {
    try {
      const {
        campus_name,
        campus_code,
        campus_phone_number,
        campus_email,
        campus_address,
        campus_about,
        campus_programs, // This comes in as a stringified JSON
        latitude,
        longitude,
      } = req.body;

      // Check if the campus_programs field is provided and parse it
      let formattedPrograms = [];
      if (campus_programs) {
        try {
          // Parse the campus_programs properly
          const parsedPrograms = JSON.parse(campus_programs);

          // Ensure parsedPrograms is treated as an array
          formattedPrograms = parsedPrograms.map((program) => ({
            program_type_id: program.program_type_id,
            programs: program.programs.map((prog) => ({
              program_name: prog.program_name,
              majors: prog.majors,
            })),
          }));
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid format for campus_programs" });
        }
      }

      // Check if file exists before proceeding with Cloudinary upload
      if (!req.file) {
        return res.status(400).json({ message: "Cover photo is required" });
      }

      // Upload to Cloudinary
      const cloudinaryResponse = cloudinary.v2.uploader.upload_stream(
        {
          folder: "campuses",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).send("Failed to upload image to Cloudinary");
          }
          const imageUrl = result.secure_url; // Cloudinary image URL

          // Create new campus document
          const newCampus = new Campus({
            campus_name,
            campus_code,
            campus_phone_number,
            campus_email,
            campus_address,
            campus_about,
            campus_cover_photo_url: imageUrl,
            campus_programs: formattedPrograms, // Correctly formatted programs
            latitude,
            longitude,
          });

          await newCampus.save();
          res.status(201).json({
            message: "Campus added successfully",
            data: newCampus,
          });
        }
      );

      // Pipe the image buffer to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(cloudinaryResponse);
    } catch (error) {
      console.error("Error creating campus:", error);
      res
        .status(500)
        .json({ message: "Error creating campus", error: error.message });
    }
  }
);

// Get All Campuses
router.get("/campuses", async (req, res) => {
  try {
    const campuses = await Campus.find();
    res.json(campuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Campus by ID
router.get("/campuses/:id", async (req, res) => {
  try {
    const campus = await Campus.findById(req.params.id);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }
    res.json(campus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/campuses/:id",
  upload.single("campus_cover_photo"),
  async (req, res) => {
    const { id } = req.params;
    const {
      campus_name,
      campus_code,
      campus_phone_number,
      campus_email,
      campus_address,
      campus_about,
      campus_programs, // Stringified JSON
      latitude,
      longitude,
    } = req.body;

    try {
      // Parse and format campus_programs
      let formattedPrograms = [];
      if (campus_programs) {
        try {
          const parsedPrograms = JSON.parse(campus_programs);
          formattedPrograms = parsedPrograms.map((program) => ({
            program_type_id: program.program_type_id,
            programs: program.programs.map((prog) => ({
              program_name: prog.program_name,
              majors: prog.majors,
            })),
          }));
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid format for campus_programs" });
        }
      }

      // Find existing campus
      const existingCampus = await Campus.findById(id);
      if (!existingCampus) {
        return res.status(404).json({ message: "Campus not found" });
      }

      // Check if a new file was uploaded
      if (req.file) {
        // Upload new image to Cloudinary
        const cloudinaryResponse = cloudinary.v2.uploader.upload_stream(
          {
            folder: "campuses",
            resource_type: "image",
          },
          async (error, result) => {
            if (error) {
              console.error("Error uploading image to Cloudinary:", error);
              return res
                .status(500)
                .send("Failed to upload image to Cloudinary");
            }

            const imageUrl = result.secure_url;

            // Update campus data
            existingCampus.campus_name = campus_name;
            existingCampus.campus_code = campus_code;
            existingCampus.campus_phone_number = campus_phone_number;
            existingCampus.campus_email = campus_email;
            existingCampus.campus_address = campus_address;
            existingCampus.campus_about = campus_about;
            existingCampus.campus_cover_photo_url = imageUrl;
            existingCampus.campus_programs = formattedPrograms;
            existingCampus.latitude = latitude;
            existingCampus.longitude = longitude;

            await existingCampus.save();
            res.status(200).json({
              message: "Campus updated successfully",
              data: existingCampus,
            });
          }
        );

        // Pipe image buffer to Cloudinary
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(cloudinaryResponse);
      } else {
        // No new image, update other fields
        existingCampus.campus_name = campus_name;
        existingCampus.campus_code = campus_code;
        existingCampus.campus_phone_number = campus_phone_number;
        existingCampus.campus_email = campus_email;
        existingCampus.campus_address = campus_address;
        existingCampus.campus_about = campus_about;
        existingCampus.campus_programs = formattedPrograms;
        existingCampus.latitude = latitude;
        existingCampus.longitude = longitude;

        await existingCampus.save();
        res.status(200).json({
          message: "Campus updated successfully (without image update)",
          data: existingCampus,
        });
      }
    } catch (error) {
      console.error("Error updating campus:", error);
      res
        .status(500)
        .json({ message: "Error updating campus", error: error.message });
    }
  }
);

// Get All Campuses (Only campus_name, latitude, longitude)
router.get("/campuses", async (req, res) => {
  try {
    const campuses = await Campus.find().select(
      "campus_name latitude longitude"
    );
    res.json(campuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Campus
router.delete("/campuses/:id", async (req, res) => {
  try {
    const campus = await Campus.findByIdAndDelete(req.params.id);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }
    res.json({ message: "Campus deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
