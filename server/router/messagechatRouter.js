import { Router } from "express";
import { chatHeads, getChatMessages } from "../controller/messagechat.js";
import verifyToken from "../middleware/verifyToken.js";

const messagechatRouter = Router();

messagechatRouter.get("/heads", verifyToken, chatHeads);
messagechatRouter.get("/messages", verifyToken, getChatMessages);

export default messagechatRouter;
