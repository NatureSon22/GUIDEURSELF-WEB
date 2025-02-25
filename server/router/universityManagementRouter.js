import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import University from "../models/university.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import activitylog from "../controller/activitylog.js";

const upload = multer();

const universityManagementRouter = express.Router();

//universityManagementRouter.use(verifyToken);

universityManagementRouter.get("/:id", verifyToken, async (req, res) => {
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

universityManagementRouter.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "university_logo_url", maxCount: 1 },
    { name: "university_vector_url", maxCount: 1 },
  ]),
  async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const {
      university_history,
      university_vision,
      university_mission,
      university_core_values,
    } = req.body;

    const updatedData = {
      university_history,
      university_vision,
      university_mission,
      university_core_values,
    };

    try {
      const existingUniversity = await University.findById(id);
      if (!existingUniversity) {
        return res.status(404).json({ message: "University not found" });
      }

      let changes = [];

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

      if (req.files && req.files.university_vector_url) {
        const cloudinaryVectorResponse = await new Promise(
          (resolve, reject) => {
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
          }
        );

        updatedData.university_vector_url = cloudinaryVectorResponse.secure_url;
      }

      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] && updatedData[key] !== existingUniversity[key]) {
          changes.push(key.replace(/_/g, " ").replace(/ url/i, "")); // Remove underscores & "url"
        }
      });

      const updatedUniversity = await University.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      if (!updatedUniversity) {
        return res.status(404).json({ message: "University not found" });
      }

      if (userId && changes.length > 0) {
        await activitylog(userId, `Updated the ${changes.join(", ")}`);
      } else {
        console.warn(
          "User ID not found or no changes made, activity log not saved."
        );
      }

      res.status(200).json({
        message: "University details updated successfully",
        updatedUniversity,
      });
    } catch (error) {
      console.error("Error updating university details:", error);
      res
        .status(500)
        .json({ message: "Failed to update university details", error });
    }
  }
);

export default universityManagementRouter;
