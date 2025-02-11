import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getAllRoleTypes,
  getRoleById,
  addRoleType,
  updateRolePermissions,
} from "../controller/role.js";
import multer from "multer";

const roleTypesRouter = Router();
//roleTypesRouter.use(verifyToken);

const upload = multer();

roleTypesRouter.get("/", getAllRoleTypes);
roleTypesRouter.get("/:roleId", getRoleById);
roleTypesRouter.post("/add-role", upload.none(), addRoleType);
roleTypesRouter.put("/update-role", upload.none(), updateRolePermissions);

export default roleTypesRouter;
