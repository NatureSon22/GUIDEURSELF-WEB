import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";
import storage from "../config/storage.js";
import { getTemplates, postTemplate } from "../controller/template.js";

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total size limit

const upload = multer({
  storage: storage("templates"),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const checkTotalSize = (req, res, next) => {
  const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    return res.status(400).json({
      message: `Total file size exceeds the 100MB limit. Uploaded size: ${(
        totalSize /
        (1024 * 1024)
      ).toFixed(2)}MB`,
    });
  }
  next();
};

const templateRouter = Router();

//templateRouter.use(verifyToken);

templateRouter.get("/", getTemplates);

templateRouter.post(
  "/upload-template",
  upload.array("template", 10),
  checkTotalSize,
  postTemplate
);

// Error handling middleware
templateRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  if (err.message === "File type is not allowed") {
    return res.status(400).json({ message: "File type is not allowed" });
  }

  return res.status(500).json({ message: "Internal Server Error" });
});

export default templateRouter;
