import { Router } from "express";
import {
  getAllRoleTypes,
  getRoleById,
  addRoleType,
  updateRolePermissions,
  deleteRole,
  updateRoleName,
  deleteRolePermission,
} from "../controller/role.js";
import multer from "multer";

const roleTypesRouter = Router();

const upload = multer();

roleTypesRouter.get("/", getAllRoleTypes);
roleTypesRouter.get("/:roleId", getRoleById);
roleTypesRouter.post("/add-role", upload.none(), addRoleType);
roleTypesRouter.put("/update-role", upload.none(), updateRolePermissions);
roleTypesRouter.put("/update-role-name", upload.none(), updateRoleName);
roleTypesRouter.delete("/delete-role", upload.none(), deleteRole);
roleTypesRouter.delete(
  "/delete-role-permission",
  upload.none(),
  deleteRolePermission
);

export default roleTypesRouter;
