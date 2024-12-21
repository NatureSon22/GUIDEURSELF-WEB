import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getAllRoleTypes, addRoleType } from "../controller/role.js";
import multer from "multer";

const roleTypesRouter = Router();
roleTypesRouter.use(verifyToken);

const upload = multer();

roleTypesRouter.get("/", getAllRoleTypes);
roleTypesRouter.post("/add-role", upload.none(), addRoleType);

export default roleTypesRouter;
