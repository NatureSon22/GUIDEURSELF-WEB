import express from "express";
import Campus from "../models/campusModel.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import verifyToken from "../middleware/verifyToken.js";

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
  upload.fields([
    { name: "campus_cover_photo", maxCount: 1 },
    { name: "floor_photo", maxCount: 10 },
    { name: "marker_photo", maxCount: 10 },
  ]),
  async (req, res) => {
    console.log("Request received:", req.body);
    console.log("Files received:", req.files);
    console.log("Params:", req.params);

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
      floors, // Optional floors data
    } = req.body;

    try {
      // Parse campus_programs if provided
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
          return res.status(400).json({ message: "mInvalid format for campus_programs" });
        }
      }

      // Find existing campus
      const existingCampus = await Campus.findById(id);
      if (!existingCampus) {
        return res.status(404).json({ message: "Campus not found" });
      }

      // Update fields if provided
      if (campus_name) existingCampus.campus_name = campus_name;
      if (campus_code) existingCampus.campus_code = campus_code;
      if (campus_phone_number) existingCampus.campus_phone_number = campus_phone_number;
      if (campus_email) existingCampus.campus_email = campus_email;
      if (campus_address) existingCampus.campus_address = campus_address;
      if (campus_about) existingCampus.campus_about = campus_about;
      if (latitude) existingCampus.latitude = latitude;
      if (longitude) existingCampus.longitude = longitude;
      if (formattedPrograms.length) existingCampus.campus_programs = formattedPrograms;

      // Update campus cover photo
      if (req.files["campus_cover_photo"]) {
        const campusCoverPhoto = req.files["campus_cover_photo"][0];
        const campusCoverPhotoUrl = await uploadToCloudinary(campusCoverPhoto.buffer, "campus_cover_photo");
        existingCampus.campus_cover_photo_url = campusCoverPhotoUrl;
      }

      // Process floors if provided
      if (floors) {
        const parsedFloors = JSON.parse(floors);

        // Iterate over new floors
        parsedFloors.forEach((newFloor) => {
          const existingFloor = existingCampus.floors.find(
            (floor) => floor.floor_name === newFloor.floor_name
          );

          if (!existingFloor) {
            existingCampus.floors.push({
              floor_name: newFloor.floor_name,
              floor_photo_url: "",
              markers: newFloor.markers || [],
            });
          }
        });

        // Upload floor photos
        if (req.files["floor_photo"]) {
          const floorPhotos = req.files["floor_photo"];
          const floorUrls = await Promise.all(
            floorPhotos.map((photo) => uploadToCloudinary(photo.buffer, "floor_photos"))
          );

          floorUrls.forEach((url, index) => {
            const floorToUpdate = existingCampus.floors[existingCampus.floors.length - floorUrls.length + index];
            if (floorToUpdate) {
              floorToUpdate.floor_photo_url = url;
            }
          });
        }

        // Upload and assign marker photos
        if (req.files["marker_photo"]) {
          const markerPhotos = req.files["marker_photo"];
          const markerUrls = await Promise.all(
            markerPhotos.map((photo) => uploadToCloudinary(photo.buffer, "marker_photos"))
          );

          existingCampus.floors.forEach((floor) => {
            floor.markers.forEach((marker, index) => {
              if (markerUrls[index]) {
                marker.marker_photo_url = markerUrls[index];
              }
            });
          });
        }
      }

      // Save the updated campus
      await existingCampus.save();

      res.status(200).json({
        message: "Campus updated successfully",
        data: existingCampus,
      });
    } catch (error) {
      console.error("Error updating campus:", error);
      res.status(500).json({ message: "Error updating campus", error: error.message });
    }
  }
);

// Helper function to upload file to Cloudinary and return the URL
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const cloudinaryResponse = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject("Error uploading image to Cloudinary");
        } else {
          resolve(result.secure_url);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(cloudinaryResponse);
  });
};

// Update floors for a specific campus
router.put("/campuses/:id/floors", async (req, res) => {
  const { id } = req.params; // Campus ID
  const { floors } = req.body; // Updated floors array

  try {
    // Find the campus
    const campus = await Campus.findById(id);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Update the floors array
    campus.floors = floors;

    // Save the updated campus
    await campus.save();

    res.status(200).json({
      message: "Floors updated successfully",
      data: campus.floors,
    });
  } catch (error) {
    console.error("Error updating floors:", error);
    res.status(500).json({ message: "Error updating floors", error: error.message });
  }
});

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
