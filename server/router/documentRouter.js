import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getAllFolders,
  createDocument,
  getAllDocuments,
  getDocument,
  uploadFilesAndCreateDocuments,
  uploadWebPage,
  saveAsDraftCreatedDocument,
  saveAsDraftUploadWebPage,
  saveAsDraftUploadDocuments,
  uploadDraftFilesAndCreateDocuments,
  syncDocument,
  deleteDocument,
  deleteDocuments,
} from "../controller/document.js";
import multer from "multer";
import storage from "../config/storage.js";
import {
  updateCreatedDocument,
  updateUploadDocument,
  updateWebUpload,
} from "../controller/documentUpdate.js";

const MAX_TOTAL_SIZE = 100 * 1024 * 1024;

const upload = multer({
  storage: storage("document"),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
  const totalSize = (req.files || []).reduce((sum, file) => sum + file.size, 0);
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

const documentRouter = Router();

documentRouter.get("/", verifyToken, getAllFolders);
documentRouter.get(
  "/get-all-documents/:folderId?",
  verifyToken,
  getAllDocuments
);
documentRouter.get("/get-document/:documentId", verifyToken, getDocument);
documentRouter.post(
  "/create-document",
  verifyToken,
  upload.none(),
  createDocument
);
documentRouter.post(
  "/upload-document",
  verifyToken,
  upload.array("document", 10),
  checkTotalSize,
  uploadFilesAndCreateDocuments
);
documentRouter.post(
  "/create-draft-document",
  verifyToken,
  upload.array("document", 10),
  checkTotalSize,
  saveAsDraftUploadDocuments
);
documentRouter.post(
  "/upload-draft-document",
  verifyToken,
  upload.array("document", 10),
  uploadDraftFilesAndCreateDocuments
);
documentRouter.post("/upload-web", verifyToken, upload.none(), uploadWebPage);
documentRouter.post(
  "/create-draft",
  verifyToken,
  upload.none(),
  saveAsDraftCreatedDocument
);
documentRouter.post(
  "/create-draft-web",
  verifyToken,
  upload.none(),
  saveAsDraftUploadWebPage
);
documentRouter.put("/sync-draft/:documentId", verifyToken, syncDocument);
documentRouter.delete(
  "/delete-document/:documentId",
  verifyToken,
  deleteDocument
);
documentRouter.delete("/delete-documents", verifyToken, deleteDocuments);
documentRouter.put(
  "/update-upload-document",
  verifyToken,
  upload.none(),
  updateUploadDocument
);

documentRouter.put(
  "/edit-create-document",
  verifyToken,
  upload.none(),
  updateCreatedDocument
);
documentRouter.put(
  "/edit-upload-document",
  verifyToken,
  upload.none(),
  updateUploadDocument
);
documentRouter.put(
  "/edit-upload-web",
  verifyToken,
  upload.none(),
  updateWebUpload
);

documentRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  if (err.message === "File type is not allowed") {
    return res.status(400).json({ message: "File type is not allowed" });
  }
  return res.status(500).json({ message: "Internal Server Error" });
});

export default documentRouter;
