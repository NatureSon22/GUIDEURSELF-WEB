import { Router } from "express";
import { getAllCampuses } from "../controller/campus.js";

const campusRouter = Router();

campusRouter.get("/", getAllCampuses);

export default campusRouter;
