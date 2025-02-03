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
} from "../controller/document.js";
import multer from "multer";
import storage from "../config/storage.js";
import { updateUploadDocument } from "../controller/documentUpdate.js";

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
documentRouter.use(verifyToken);

documentRouter.get("/", getAllFolders);
documentRouter.get("/get-all-documents/:folderId?", getAllDocuments);
documentRouter.get("/get-document/:documentId", getDocument);
documentRouter.post("/create-document", upload.none(), createDocument);
documentRouter.post(
  "/upload-document",
  upload.array("document", 10),
  checkTotalSize,
  uploadFilesAndCreateDocuments
);
documentRouter.post(
  "/create-draft-document",
  upload.array("document", 10),
  checkTotalSize,
  saveAsDraftUploadDocuments
);
documentRouter.post(
  "/upload-draft-document",
  upload.none(),
  uploadDraftFilesAndCreateDocuments
);
documentRouter.post("/upload-web", upload.none(), uploadWebPage);
documentRouter.post("/create-draft", upload.none(), saveAsDraftCreatedDocument);
documentRouter.post(
  "/create-draft-web",
  upload.none(),
  saveAsDraftUploadWebPage
);
documentRouter.put("/sync-draft/:documentId", syncDocument);
documentRouter.delete("/delete-document/:documentId", deleteDocument);
documentRouter.put(
  "/update-upload-document",
  upload.none(),
  updateUploadDocument
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
