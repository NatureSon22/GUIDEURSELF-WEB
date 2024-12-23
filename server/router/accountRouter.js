import { Router } from "express";
import {
  addAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
  verifyAccount,
} from "../controller/accounts.js";
import multer from "multer";
import verifyToken from "../middleware/verifyToken.js";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.size > 1024 * 1024 * 5) {
      cb(new Error("File size must be less than 5MB"), false);
      return;
    }

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"), false);
    }
  },
});

const accountRouter = Router();
accountRouter.use(verifyToken);

accountRouter.get("/", getAllAccounts);
accountRouter.get("/:accountId", getAccount);
accountRouter.post("/import-add-account", upload.single("file"), addAccount);
accountRouter.post("/add-account", upload.none(), addAccount);
accountRouter.put("/update-account/:accountId", upload.none(), updateAccount);
accountRouter.put("/verify-account/:accountId", verifyAccount);

accountRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: "Server Error" });
  }
  next();
});

export default accountRouter;
