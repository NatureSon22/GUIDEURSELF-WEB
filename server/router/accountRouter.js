import { Router } from "express";
import {
  addAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
  updateAccountRoleType,
  verifyAccount,
  bulkAddAccount,
  deleteAccounts,
  getLoggedInAccount,
} from "../controller/accounts.js";
import multer from "multer";
import verifyToken from "../middleware/verifyToken.js";

// Configure multer
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (req, file, cb) => {
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

// Apply middleware
accountRouter.use(verifyToken);

// Define routes
accountRouter.get("/logged-in-account", getLoggedInAccount); // Place before conflicting routes
accountRouter.get("/", getAllAccounts);
accountRouter.get("/:accountId", getAccount);
accountRouter.post("/import-add-account", upload.none(), bulkAddAccount);
accountRouter.post("/add-account", upload.none(), addAccount);
accountRouter.put("/update-account/:accountId", upload.none(), updateAccount);
accountRouter.put("/update-account-role-type/:accountId", updateAccountRoleType);
accountRouter.put("/verify-account/:accountId", verifyAccount);
accountRouter.delete("/delete-accounts", deleteAccounts);

// Multer error handling
accountRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message || "Server Error" });
  }
});

export default accountRouter;