import { Router } from "express";
import { createConversation, createMessage, getMessages } from "../controller/testchat.js";

const testChatRouter = Router();

testChatRouter.get("/get-messages/:conversationId", getMessages);
testChatRouter.post("/create-conversation", createConversation);
testChatRouter.post("/create-message", createMessage);

export default testChatRouter;
