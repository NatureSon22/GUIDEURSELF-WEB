import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { reviewMessage, sendMessage, getMessages } from "../controller/message.js";

const messageRouter = Router();

messageRouter.post("/send-message", sendMessage);
messageRouter.get("/get-messages", getMessages);
messageRouter.put("/review-message", verifyToken, reviewMessage);

export default messageRouter;