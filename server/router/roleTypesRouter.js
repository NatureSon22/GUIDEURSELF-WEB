import { Router } from "express";
import {
  getAllRoleTypes,
  getRoleById,
  addRoleType,
  updateRolePermissions,
  deleteRole,
  updateRoleName,
  deleteRolePermission,
  addCategoryRole,
  getCategoryRole,
  updateCategoryRole,
} from "../controller/role.js";
import multer from "multer";

const roleTypesRouter = Router();

const upload = multer();

roleTypesRouter.get("/", getAllRoleTypes);
roleTypesRouter.get("/:roleId", getRoleById);
roleTypesRouter.get("/category-role/:role_id", getCategoryRole);
roleTypesRouter.post("/add-role", upload.none(), addRoleType);
roleTypesRouter.post("/add-category-role", upload.none(), addCategoryRole);
roleTypesRouter.put("/update-role", upload.none(), updateRolePermissions);
roleTypesRouter.put("/update-role-name", upload.none(), updateRoleName);
roleTypesRouter.put("/update-category-role", upload.none(), updateCategoryRole);
roleTypesRouter.delete("/delete-role", upload.none(), deleteRole);
roleTypesRouter.delete(
  "/delete-role-permission",
  upload.none(),
  deleteRolePermission
);

export default roleTypesRouter;
