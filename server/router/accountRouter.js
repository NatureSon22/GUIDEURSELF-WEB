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
  updatePhoto,
  resetPassword,
  getAllInactiveAccount,
  activateAccount,
} from "../controller/accounts.js";
import multer from "multer";
import verifyToken from "../middleware/verifyToken.js";
import storage from "../config/storage.js";

const upload = multer({
  storage: storage("profiles"),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // limit size is 2MB
});

const accountRouter = Router();

accountRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal Server Error" });
});

accountRouter.get("/", verifyToken, getAllAccounts);
accountRouter.get("/logged-in-account", verifyToken, getLoggedInAccount);
accountRouter.get("/inactive-accounts", verifyToken, getAllInactiveAccount);
accountRouter.get("/:accountId", getAccount);
accountRouter.post(
  "/import-add-account",
  verifyToken,
  upload.none(),
  bulkAddAccount
);
accountRouter.post("/add-account", verifyToken, upload.none(), addAccount);
accountRouter.put("/update-account", verifyToken, upload.none(), updateAccount);
accountRouter.put(
  "/update-profile",
  verifyToken,
  (req, res, next) => {
    upload.single("profile_photo")(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  },
  updatePhoto
);
accountRouter.put(
  "/update-account-role-type/:accountId",
  verifyToken,
  updateAccountRoleType
);
accountRouter.put("/verify-account", verifyToken, verifyAccount);
accountRouter.put("/reset-password", upload.none(), resetPassword);
accountRouter.put("/activate-account/:accountId", verifyToken, activateAccount);
accountRouter.delete(
  "/delete-accounts",
  verifyToken,
  upload.none(),
  deleteAccounts
);

export default accountRouter;
