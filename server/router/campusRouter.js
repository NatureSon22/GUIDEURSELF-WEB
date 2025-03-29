import express from "express";
import  UserModel  from "../models/user.js"; // Import User model
import { Campus, ArchivedCampus, ArchivedItem } from "../models/campusModel.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import verifyToken from "../middleware/verifyToken.js";
import activitylog from "../controller/activitylog.js"
import mongoose from "mongoose";

const router = express.Router();
//router.use(verifyToken);  

// Multer storage (temporary in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// In your backend router (e.g., routes/archivedItems.js)
router.delete("/archived-items/delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ message: "No IDs provided" });

    await ArchivedItem.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Items deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting items", error: error.message });
  }
});

router.delete("/campuses/delete-bulk", async (req, res) => {
  try {
      const { ids } = req.body;
      if (!ids || !ids.length) return res.status(400).json({ message: "No IDs provided" });
  
      await ArchivedCampus.deleteMany({ _id: { $in: ids } });
  
      res.status(200).json({ message: "Items deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting items", error: error.message });
    }
});

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

      const userId = req.user?.userId; 

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

          
          if (userId) {
            await activitylog(userId, `Added new campus: ${campus_name}`);
          } else {
            console.warn("User ID not found, activity log not saved.");
          }

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

router.get("/campuses/:campusId/dependencies", async (req, res) => {
  try {
    const { campusId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campusId)) {
      return res.status(400).json({ error: "Invalid Campus ID" });
    }

    // ❌ Do NOT populate markers because they're embedded
    const campus = await Campus.findById(campusId).lean();

    if (!campus) {
      return res.status(404).json({ error: "Campus not found" });
    }

    // 🔹 Count users that reference this campusId
    const userCount = await UserModel.countDocuments({ campus_id: campusId });

    // ✅ Check if there are dependencies
    const hasDependencies =
      (campus.floors && campus.floors.length > 0) ||
      (campus.campus_programs && campus.campus_programs.length > 0) ||
      userCount > 0; // 🆕 Check users using the campus

    res.json({ hasDependencies });
  } catch (error) {
    console.error("Error checking campus dependencies:", error);
    res.status(500).json({ error: "Internal server error" });
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
  const userId = req.user?.userId; 

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

    if (userId) {
      await activitylog(userId, `Edited existing campus: ${existingCampus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    await existingCampus.save();
    res.status(200).json({ message: "Campus updated successfully", data: existingCampus });

  } catch (error) {
    console.error("Error updating campus:", error);
    res.status(500).json({ message: "Error updating campus", error: error.message });
  }
});


router.put("/campuses/floors/:campusId/:floorId", upload.single("floor_photo"), async (req, res) => {
  const { campusId, floorId } = req.params;
  const { floor_name } = req.body;
  const userId = req.user?.userId;
  const file = req.file;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    const floorToUpdate = campus.floors.id(floorId);
    if (!floorToUpdate) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Update floor name if provided
    if (floor_name) {
      floorToUpdate.floor_name = floor_name;
    }

    // Update floor photo if provided
    if (file) {
      const photoUrl = await uploadToCloudinary(file.buffer, "floor_photos");
      floorToUpdate.floor_photo_url = photoUrl;
    }

    if (userId) {
      await activitylog(userId, `Updated floor ${floorToUpdate.floor_name} for: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    await campus.save();
    res.status(200).json({ 
      message: "Floor updated successfully", 
      data: floorToUpdate 
    });
  } catch (error) {
    console.error("Error updating floor:", error);
    res.status(500).json({ message: "Error updating floor", error: error.message });
  }
});
router.put("/campuses/floors/:campusId", upload.fields([{ name: "floor_photo", maxCount: 10 }]), async (req, res) => {
  const { campusId } = req.params;
  const { floors } = req.body;
  const userId = req.user?.userId; 

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

      
    if (userId) {
      await activitylog(userId, `Added new floor for: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
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
  const userId = req.user?.userId; 

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) return res.status(404).json({ message: "Campus not found" });

    const floor = campus.floors.id(floorId);
    if (!floor) return res.status(404).json({ message: "Floor not found" });

    const newMarker = {
      marker_name: req.body.marker_name || "",
      marker_description: req.body.marker_description || "", 
      sub_info: req.body.sub_info || "", 
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

    if (userId) {
      await activitylog(userId, `Added new marker: ${newMarker.marker_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

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
  const userId = req.user?.userId; 

  try {
    // Find the campus
    const campus = await Campus.findById(id);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Update the floors array
    campus.floors = floors;

    // Save the updated campus

    if (userId) {
      await activitylog(userId, `Updated floor of campus: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

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

router.get("/campuses/floors/:floorId/markers", async (req, res) => {
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

router.get("/campuses/campusmajors", async (req, res) => {
  const { programname, campusId } = req.query;

  try {
    const campus = await Campus.findById(campusId);
    if (!campus) return res.status(404).json({ error: "Campus not found" });

    const program = campus.campusPrograms.find(p => p.programName === programname);
    if (!program) return res.status(404).json({ error: "Program not found in this campus" });

    res.json(program.majors); // Return the list of existing majors
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


router.put(
  "/campuses/:campusId/floors/:floorId/markers/:markerId",
  upload.single("marker_photo"),
  async (req, res) => {
    const { campusId, floorId, markerId } = req.params;
    const { marker_name, marker_description, sub_info, category, latitude, longitude } = req.body;
    const userId = req.user?.userId;

    console.log("Request body:", req.body); // Debugging: Log the entire request body
    console.log("Received sub_info:", sub_info); // Debugging: Log sub_info

    try {
      const campus = await Campus.findById(campusId);
      if (!campus) return res.status(404).json({ message: "Campus not found" });

      const floor = campus.floors.id(floorId);
      if (!floor) return res.status(404).json({ message: "Floor not found" });

      const marker = floor.markers.id(markerId);
      if (!marker) return res.status(404).json({ message: "Marker not found" });

      // Update the marker details
      if (marker_name !== undefined) marker.marker_name = marker_name;
      if (marker_description !== undefined) marker.marker_description = marker_description;
      if (sub_info !== undefined) {
        marker.sub_info = sub_info; // Ensure sub_info is updated
        console.log("Updated sub_info:", marker.sub_info); // Debugging: Log updated sub_info
      }
      if (category !== undefined) marker.category = category;
      if (latitude !== undefined) marker.latitude = parseFloat(latitude);
      if (longitude !== undefined) marker.longitude = parseFloat(longitude);

      console.log("Updated marker:", marker); // Debugging: Log the updated marker

      // Handle image upload
      if (req.file) {
        const markerPhotoUrl = await uploadToCloudinary(req.file.buffer, "marker_photos");
        marker.marker_photo_url = markerPhotoUrl;
      }

      // Log activity
      if (userId) {
        await activitylog(userId, `Updated existing marker of campus: ${campus.campus_name}`);
      } else {
        console.warn("User ID not found, activity log not saved.");
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

router.delete("/campuses/:campusId/floors/:floorId/markers/:markerId", async (req, res) => {
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

router.post('/campuses/unarchive/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId; 

    // Find the archived campus
    const archivedCampus = await ArchivedCampus.findById(id);
    if (!archivedCampus) {
      return res.status(404).send({ message: "Archived campus not found" });
    }

    // Create a new campus document in the active collection
    const newCampus = new Campus(archivedCampus.toObject());

    if (userId) {
      await activitylog(userId, `Retrieved campus: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    await newCampus.save();

    // Delete the archived campus
    await ArchivedCampus.findByIdAndDelete(id);

    res.status(200).send(newCampus);
  } catch (error) {
    res.status(500).send({ message: "Error unarchiving campus", error });
  }
});

router.post("/archived-campuses", async (req, res) => {
  const { campus_id } = req.body; // Ensure the frontend sends `campus_id`
  const userId = req.user?.userId; 

  try {
    // Find the campus by ID
    const campus = await Campus.findById(campus_id);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Delete all archived items related to this campus
    await ArchivedItem.deleteMany({ campus_id });

    // Move the campus to the ArchivedCampus collection
    const archivedCampus = new ArchivedCampus(campus.toObject());

    if (userId) {
      await activitylog(userId, `Archived a campus: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    await archivedCampus.save();

    res.status(200).json({ message: "Campus archived successfully" });
  } catch (error) {
    console.error("Error archiving campus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/archived-campuses", async (req, res) => {
  try {
    // Fetch all archived campuses sorted by `date_archived` in descending order
    const archivedCampuses = await ArchivedCampus.find({})
      .sort({ date_archived: -1 }); // Sort by `date_archived` (latest first)

    res.status(200).json(archivedCampuses);
  } catch (error) {
    console.error("Error fetching archived campuses:", error);
    res.status(500).json({ message: "Failed to fetch archived campuses" });
  }
});

router.post("/archived-campuses/unarchive/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId; 

    // Step 1: Find the archived campus
    const archivedCampus = await ArchivedCampus.findById(id);
    if (!archivedCampus) {
      return res.status(404).json({ message: "Archived campus not found" });
    }

    // Step 2: Create a new campus document in the active collection
    const newCampusData = {
      ...archivedCampus.toObject(), // Copy all fields from the archived campus
      date_added: new Date(), // Set the current date as the date_added field
    };

    const newCampus = new Campus(newCampusData);


    // Step 3: Save the new campus to the active collection
    await newCampus.save();

    // Step 4: Delete the archived campus from the archived collection
    await ArchivedCampus.findByIdAndDelete(id);

    // Step 5: Send a success response
    res.status(200).json({
      message: "Campus unarchived successfully",
      campus: newCampus,
    });
  } catch (error) {
    console.error("Error unarchiving campus:", error);
    res.status(500).json({ message: "Failed to unarchive campus" });
  }
});

router.post("/campuses/:campusId/floors/:floorId/archive", async (req, res) => {
  try {
    const { campusId, floorId } = req.params;
    const userId = req.user?.userId; 

    // Step 1: Find the campus
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Step 2: Find the floor
    const floorToArchive = campus.floors.find(floor => floor._id.toString() === floorId);
    if (!floorToArchive) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Step 3: Archive the floor (store it in ArchivedItem)
    const archivedItem = new ArchivedItem({
      type: "floor", // Set type as floor
      floor_data: floorToArchive.toObject(), // Store floor details
      location_data: null, // Make sure this is null to prevent validation errors
      campus_id: campusId,
      date_archived: new Date(),
      campus_name: campus.campus_name,
    });

    if (userId) {
       await activitylog(userId, `Archived floor from: ${campus.campus_name}`);
     } else {
       console.warn("User ID not found, activity log not saved.");
     }

    await archivedItem.save();

    // Step 4: Remove the floor from the original campus
    campus.floors = campus.floors.filter(floor => floor._id.toString() !== floorId);

    await campus.save();

    // Step 5: Respond with success
    res.status(201).json({
      message: "Floor archived successfully",
      archivedItem,
    });
  } catch (error) {
    console.error("Error archiving floor:", error);
    res.status(500).json({ message: "Failed to archive floor" });
  }
});

router.get("/archived-items", async (req, res) => {
  try {
    // Fetch all archived items, populate the campus name, and sort by `date_archived`
    const archivedItems = await ArchivedItem.find({})
      .populate("campus_id", "campus_name") // Populate the campus_name field
      .sort({ date_archived: -1 }); // Sort by `date_archived` (latest first)

      console.log(archivedItems);
    res.status(200).json(archivedItems);
  } catch (error) {
    console.error("Error fetching archived items:", error);
    res.status(500).json({ message: "Failed to fetch archived items" });
  }
});

router.post("/archived-items/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId; 

    // Step 1: Find the archived item
    const archivedItem = await ArchivedItem.findById(id);
    if (!archivedItem) {
      return res.status(404).json({ message: "Archived item not found" });
    }

    // Step 2: Find the original campus
    const campus = await Campus.findById(archivedItem.campus_id);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Step 3: Restore the item
    if (archivedItem.type === "floor") {
      campus.floors.push(archivedItem.floor_data);
    } else if (archivedItem.type === "location") {
      // Get the floor ID stored in the archived data
      const floor = campus.floors.id(archivedItem.floor_id);
      if (!floor) {
        return res.status(404).json({ message: "Floor not found for this marker" });
      }

      // Restore the marker to the floor
      floor.markers.push(archivedItem.location_data);
    }

    
    if (userId) {
      await activitylog(userId, `Retrieved an item from: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    // Step 4: Save changes
    await campus.save();

    // Step 5: Delete the archived item
    await ArchivedItem.findByIdAndDelete(id);

    res.status(200).json({ message: "Item unarchived successfully", campus });
  } catch (error) {
    console.error("Error unarchiving item:", error);
    res.status(500).json({ message: "Failed to unarchive item" });
  }
});



router.post("/campuses/:campusId/locations/:locationId/archive", async (req, res) => {
  try {
    const { campusId, locationId } = req.params;
    console.log(`Archiving location ${locationId} from campus ${campusId}`);
    const userId = req.user?.userId; 


    // Step 1: Find the campus
    const campus = await Campus.findById(campusId);
    if (!campus) {
      console.log("Campus not found");
      return res.status(404).json({ message: "Campus not found" });
    }

    // Step 2: Find the specific location to archive
    const locationToArchive = campus.locations.find(
      (location) => location._id.toString() === locationId
    );
    if (!locationToArchive) {
      console.log("Location not found");
      return res.status(404).json({ message: "Location not found" });
    }

    // Step 3: Create a new archived item for the location
    const archivedItem = new ArchivedItem({
      type: "location", // Set the type to "location"
      location_data: locationToArchive.toObject(), // Copy all fields from the location
      campus_id: campusId, // Reference to the original campus
      date_archived: new Date(), // Set the current date as the date_archived field
      campus_name: campus.campus_name,
    });

    // Step 4: Save the archived item
    await archivedItem.save();

    // Step 5: Remove the location from the original campus
    campus.locations = campus.locations.filter(
      (location) => location._id.toString() !== locationId
    );

    
    if (userId) {
      await activitylog(userId, `Archived location from: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    // Step 6: Save the updated campus
    await campus.save();

    // Step 7: Send a success response
    console.log("Location archived successfully");
    res.status(201).json({
      message: "Location archived successfully",
      archivedItem,
    });
  } catch (error) {
    console.error("Error archiving location:", error);
    res.status(500).json({ message: "Failed to archive location" });
  }
});

// router.post("/archive-item", async (req, res) => {
//   try {
//     const { type, floor_data, location_data, campus_id } = req.body;

//     // Create a new archived item
//     const archivedItem = new ArchivedItem({
//       type,
//       floor_data: type === "floor" ? floor_data : undefined,
//       location_data: type === "location" ? location_data : undefined,
//       campus_id,
//     });

//     // Save the archived item
//     await archivedItem.save();

//     // Send a success response
//     res.status(201).json({
//       message: "Item archived successfully",
//       archivedItem,
//     });
//   } catch (error) {
//     console.error("Error archiving item:", error);
//     res.status(500).json({ message: "Failed to archive item" });
//   }
// });

router.post("/campuses/:campusId/floors/:floorId/markers/:markerId/archive", async (req, res) => {
  try {
    const { campusId, floorId, markerId } = req.params;
    const userId = req.user?.userId; 

    // Step 1: Find the campus
    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    // Step 2: Find the specific floor
    const floor = campus.floors.find((floor) => floor._id.toString() === floorId);
    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Step 3: Find the specific marker to archive
    const markerToArchive = floor.markers.find(
      (marker) => marker._id.toString() === markerId
    );
    if (!markerToArchive) {
      return res.status(404).json({ message: "Marker not found" });
    }

    // Step 4: Create a new archived item for the marker
    const archivedItem = new ArchivedItem({
      type: "location", // Set type to "location"
      location_data: markerToArchive.toObject(), // Store marker details
      floor_id: floorId, // 🔹 Store floor ID to track its original location
      campus_id: campusId, // Store campus ID
      campus_name: campus.campus_name, // Add campus_name to the archived item
      date_archived: new Date(),
    });

    // Step 5: Save the archived item
    await archivedItem.save();

    // Step 6: Remove the marker from the floor
    floor.markers = floor.markers.filter(
      (marker) => marker._id.toString() !== markerId
    );

    
   if (userId) {
      await activitylog(userId, `Archived location from: ${campus.campus_name}`);
    } else {
      console.warn("User ID not found, activity log not saved.");
    }

    // Step 7: Save the updated campus
    await campus.save();

    // Step 8: Send a success response
    res.status(201).json({
      message: "Marker archived successfully",
      archivedItem,
    });
  } catch (error) {
    console.error("Error archiving marker:", error);
    res.status(500).json({ message: "Failed to archive marker" });
  }
});

export default router;
