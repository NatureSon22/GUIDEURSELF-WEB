import { Router } from "express";
import {
  addAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
} from "../controller/accounts.js";
import multer from "multer";
import verifyToken from "../middleware/verifyToken.js";

const accountRouter = Router();
accountRouter.use(verifyToken);

const upload = multer();

accountRouter.get("/", getAllAccounts);
accountRouter.get("/:accountId", getAccount);
accountRouter.post("/add-account", upload.none(), addAccount);
accountRouter.put("/update-account/:accountId", upload.none(), updateAccount);

export default accountRouter;
