import { Router } from "express";
import { chatHeads } from "../controller/messagechat.js";
import verifyToken from "../middleware/verifyToken.js";

const messagechatRouter = Router();

messagechatRouter.get("/heads", verifyToken, chatHeads);

export default messagechatRouter;
