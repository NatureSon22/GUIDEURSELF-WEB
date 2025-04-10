import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createConversation,
  createConversationAsGuest,
  deleteAll,
  deleteConversation,
  getAllConversations,
  getConversation,
} from "../controller/conversation.js";

const conversationRouter = Router();

conversationRouter.get(
  "/get-all-conversations",
  verifyToken,
  getAllConversations
);
conversationRouter.get(
  "/get-conversation/:conversation_id",
  verifyToken,
  getConversation
);
conversationRouter.post(
  "/create-conversation",
  verifyToken,
  createConversation
);
conversationRouter.post(
  "/create-conversation-as-guest",
  createConversationAsGuest
);
conversationRouter.delete(
  "/delete-conversation/:id",
  verifyToken,
  deleteConversation
);
conversationRouter.delete("/delete-all-conversations", verifyToken, deleteAll);

export default conversationRouter;
