import { Router } from "express";
import { getTrends, recordTrend } from "../controller/trend.js";
import verifyToken from "../middleware/verifyToken.js";

const trendRouter = Router();

trendRouter.get("/get-trends", verifyToken, getTrends);
trendRouter.post("/record-trend", verifyToken, recordTrend);

export default trendRouter;
