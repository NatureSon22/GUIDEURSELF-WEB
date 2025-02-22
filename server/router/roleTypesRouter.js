import { Router } from "express";
import {
  getAllRoleTypes,
  getRoleById,
  addRoleType,
  updateRolePermissions,
} from "../controller/role.js";
import multer from "multer";

const roleTypesRouter = Router();

const upload = multer();

roleTypesRouter.get("/", getAllRoleTypes);
roleTypesRouter.get("/:roleId", getRoleById);
roleTypesRouter.post("/add-role", upload.none(), addRoleType);
roleTypesRouter.put("/update-role", upload.none(), updateRolePermissions);

export default roleTypesRouter;
