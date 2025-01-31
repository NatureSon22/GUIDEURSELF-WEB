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

router.get("/campus", async (req, res) => {
  try {
    const campuses = await Campus.find();
    res.json({ success: true, campuses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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

router.put("/campuses/:id", upload.fields([{ name: "campus_cover_photo", maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { campus_name, campus_code, campus_phone_number, campus_email, campus_address, campus_about, campus_programs, latitude, longitude } = req.body;

  try {
    const existingCampus = await Campus.findById(id);
    if (!existingCampus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Update campus info
    if (campus_name) existingCampus.campus_name = campus_name;
    if (campus_code) existingCampus.campus_code = campus_code;
    if (campus_phone_number) existingCampus.campus_phone_number = campus_phone_number;
    if (campus_email) existingCampus.campus_email = campus_email;
    if (campus_address) existingCampus.campus_address = campus_address;
    if (campus_about) existingCampus.campus_about = campus_about;
    if (latitude) existingCampus.latitude = latitude;
    if (longitude) existingCampus.longitude = longitude;

    // Handle campus programs
    if (campus_programs) {
      try {
        const parsedPrograms = JSON.parse(campus_programs);
        existingCampus.campus_programs = parsedPrograms;
      } catch (error) {
        return res.status(400).json({ message: "Invalid format for campus_programs" });
      }
    }

    // Handle campus cover photo
    if (req.files["campus_cover_photo"]) {
      const campusCoverPhoto = req.files["campus_cover_photo"][0];
      const campusCoverPhotoUrl = await uploadToCloudinary(campusCoverPhoto.buffer, "campus_cover_photo");
      existingCampus.campus_cover_photo_url = campusCoverPhotoUrl;
    }

    await existingCampus.save();
    res.status(200).json({ message: "Campus updated successfully", data: existingCampus });

  } catch (error) {
    console.error("Error updating campus:", error);
    res.status(500).json({ message: "Error updating campus", error: error.message });
  }
});

router.put("/campuses/floors/:campusId", upload.fields([{ name: "floor_photo", maxCount: 10 }]), async (req, res) => {
  const { campusId } = req.params;
  const { floors } = req.body;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    if (floors) {
      const parsedFloors = JSON.parse(floors);

      parsedFloors.forEach((newFloor) => {
        const existingFloor = campus.floors.find((floor) => floor.floor_name === newFloor.floor_name);
        if (!existingFloor) {
          campus.floors.push({
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
          const floorToUpdate = campus.floors[campus.floors.length - floorUrls.length + index];
          if (floorToUpdate) {
            floorToUpdate.floor_photo_url = url;
          }
        });
      }

      await campus.save();
      res.status(200).json({ message: "Floors updated successfully", data: campus });
    }
  } catch (error) {
    console.error("Error updating floors:", error);
    res.status(500).json({ message: "Error updating floors", error: error.message });
  }
});

router.get("/campuses/:campusId/floors/:floorId/markers", async (req, res) => {
  const { campusId, floorId } = req.params;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) return res.status(404).json({ message: "Campus not found" });

    const floor = campus.floors.id(floorId);
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    if (!floor.markers || floor.markers.length === 0) {
      return res.status(404).json({ message: "No markers found on this floor" });
    }

    res.status(200).json({ markers: floor.markers });
  } catch (error) {
    console.error("Error fetching markers:", error);
    res.status(500).json({ message: "Error fetching markers", error: error.message });
  }
});

router.put("/campuses/:campusId/floors/:floorId/markers", upload.fields([{ name: "marker_photo", maxCount: 1 }]), async (req, res) => {
  const { campusId, floorId } = req.params;
  const { latitude, longitude } = req.body;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) return res.status(404).json({ message: "Campus not found" });

    const floor = campus.floors.id(floorId);
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    const newMarker = {
      marker_name: req.body.marker_name || "",
      marker_description: req.body.marker_description || "", 
      category: req.body.category || "", 
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null, 
      marker_photo_url: "",
    };

    if (req.files["marker_photo"]) {
      const markerPhoto = req.files["marker_photo"][0];
      const markerPhotoUrl = await uploadToCloudinary(markerPhoto.buffer, "marker_photos");
      newMarker.marker_photo_url = markerPhotoUrl;
    }

    floor.markers.push(newMarker);
    await campus.save();

    res.status(200).json({ message: "Marker added/updated successfully", data: campus });
  } catch (error) {
    console.error("Error updating marker:", error);
    res.status(500).json({ message: "Error updating marker", error: error.message });
  }
});

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

router.get("/floors/:floorId/markers", async (req, res) => {
  const { floorId } = req.params;

  try {
    // Find the campus containing the specified floor
    const campus = await Campus.findOne({ "floors._id": floorId });

    if (!campus) {
      return res.status(404).json({ error: "Floor not found" });
    }

    // Extract the markers for the specified floor
    const floor = campus.floors.id(floorId);
    if (!floor) {
      return res.status(404).json({ error: "Floor not found" });
    }

    res.status(200).json(floor.markers); // Send the markers
  } catch (error) {
    console.error("Error fetching markers:", error);
    res.status(500).json({ error: "Failed to fetch markers" });
  }
});

router.put(
  "/campuses/:campusId/floors/:floorId/markers/:markerId",
  upload.single("marker_photo"), // Single file upload for the marker photo
  async (req, res) => {
    const { campusId, floorId, markerId } = req.params;
    const { marker_name, marker_description, category, latitude, longitude } = req.body;

    try {
      // Find the campus
      const campus = await Campus.findById(campusId);
      if (!campus) return res.status(404).json({ message: "Campus not found" });

      // Find the floor
      const floor = campus.floors.id(floorId);
      if (!floor) return res.status(404).json({ message: "Floor not found" });

      // Find the marker
      const marker = floor.markers.id(markerId);
      if (!marker) return res.status(404).json({ message: "Marker not found" });

      // Update the marker details
      marker.marker_name = marker_name || marker.marker_name;
      marker.marker_description = marker_description || marker.marker_description;
      marker.category = category || marker.category;
      marker.latitude = latitude ? parseFloat(latitude) : marker.latitude;
      marker.longitude = longitude ? parseFloat(longitude) : marker.longitude;

      console.log("Received Data:", { marker_name, marker_description, latitude, longitude });

      // Handle image upload
      if (req.file) {
        const markerPhotoUrl = await uploadToCloudinary(req.file.buffer, "marker_photos");
        marker.marker_photo_url = markerPhotoUrl;
      }

      // Save the updated campus
      await campus.save();

      res.status(200).json({
        message: "Marker updated successfully",
        data: { campusId, floorId, marker },
      });
    } catch (error) {
      console.error("Error updating marker:", error);
      res.status(500).json({ message: "Error updating marker", error: error.message });
    }
  }
);

router.get("/markers", async (req, res) => {
  try {
    // Find all campuses and retrieve their floors and markers
    const campuses = await Campus.find({}, "floors.markers");

    // Flatten markers and include campus_id with each marker
    const markers = campuses.flatMap((campus) =>
      campus.floors.flatMap((floor) =>
        floor.markers.map((marker) => ({
          ...marker.toObject(), // Convert marker to a plain object
          campus_id: campus._id, // Attach the campus ID
        }))
      )
    );

    res.status(200).json({ success: true, markers });
  } catch (error) {
    console.error("Error fetching markers:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:campusId/floors/:floorId/markers/:markerId", async (req, res) => {
  const { campusId, floorId, markerId } = req.params;

  try {
    // Find the campus and update the floor's markers array
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    const floor = campus.floors.id(floorId);
    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Remove the marker from the floor
    floor.markers = floor.markers.filter(marker => marker._id.toString() !== markerId);

    // Save the updated campus document
    await campus.save();

    res.status(200).json({ message: "Marker deleted successfully", floor });
  } catch (error) {
    res.status(500).json({ message: "Error deleting marker", error: error.message });
  }
});

router.put("/campuses/:campusId/update-floor-order", async (req, res) => {
  try {
    const { campusId } = req.params;
    const { floors } = req.body; // Array of floors with updated order

    const campus = await Campus.findById(campusId);
    if (!campus) return res.status(404).json({ message: "Campus not found" });

    // Update floor orders
    floors.forEach((updatedFloor) => {
      const floor = campus.floors.id(updatedFloor._id);
      if (floor) {
        floor.order = updatedFloor.order;
      }
    });

    await campus.save();
    res.json({ message: "Floor order updated successfully", data: campus });
  } catch (error) {
    console.error("Error updating floor order:", error);
    res.status(500).json({ message: "Error updating floor order", error: error.message });
  }
});



export default router;
