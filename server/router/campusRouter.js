import { Router } from "express";
import { getAllCampuses } from "../controller/campus.js";
import verifyToken from "../middleware/verifyToken.js";

const campusRouter = Router();
campusRouter.use(verifyToken);

campusRouter.get("/", getAllCampuses);

export default campusRouter;
