import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";
import storage from "../config/storage.js";
import { getTemplates, postTemplate } from "../controller/template.js";

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

const templateRouter = Router();

templateRouter.use(verifyToken);

templateRouter.get("/", getTemplates);
templateRouter.post(
  "/upload-template",
  upload.single("template"),
  postTemplate
);

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
