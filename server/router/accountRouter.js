import { Router } from "express";
import { addAccount, getAllAccounts } from "../controller/accounts.js";
import multer from "multer";

const accountRouter = Router();

const upload = multer();

accountRouter.get("/", getAllAccounts);
accountRouter.post("/add-account", upload.none(), addAccount);

export default accountRouter;
