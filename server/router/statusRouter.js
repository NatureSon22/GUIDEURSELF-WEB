import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getAllStatus } from "../controller/status.js";

const statusRouter = Router();
statusRouter.use(verifyToken);

statusRouter.get("/", getAllStatus);

export default statusRouter;
