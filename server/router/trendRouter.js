import { Router } from "express";
import { recordTrend } from "../controller/trend.js";
import verifyToken from "../middleware/verifyToken.js";

const trendRouter = Router();

trendRouter.post("/record-trend", verifyToken, recordTrend);

export default trendRouter;
