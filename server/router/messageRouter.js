import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  reviewMessage,
  sendMessage,
  getMessages,
  tallyReview,
  getMessagesClassification,
  botUsage,
} from "../controller/message.js";

const messageRouter = Router();

messageRouter.get("/get-reviews", tallyReview);
messageRouter.get("/get-messages", getMessages);
messageRouter.get("/message-classifications", getMessagesClassification);
messageRouter.get("/bot-usage", botUsage);
messageRouter.post("/send-message", sendMessage);
messageRouter.put("/review-message", verifyToken, reviewMessage);

export default messageRouter;
