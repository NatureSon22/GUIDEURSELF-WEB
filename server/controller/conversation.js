import ConversationModel from "../models/conversation.js";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import { config } from "dotenv";

config();

const createConversation = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    const response = await fetch(CODY_URLS.CREATE_CONVERSATION(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ name: "sample", bot_id: process.env.CODY_BOT_ID }),
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Failed to create conversation" });
    }

    const {
      data: { id, name: conversationName },
    } = await response.json();

    await ConversationModel.create({
      user_id: userId,
      conversation_id: id,
      conversation_name: conversationName,
    });

    res.status(201).json({ message: "Conversation created successfully", id });
  } catch (error) {
    console.error("Request failed:", error.message);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await ConversationModel.find({ user_id: userId });

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Request failed:", error.message);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

const getConversation = async (req, res) => {
  try {
    const { conversation_id } = req.params;

    const conversation = await ConversationModel.findOne({
      conversation_id,
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("Request failed:", error.message);
    res.status(500).json({ message: "Failed to retrieve conversation" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await ConversationModel.findOne({ _id: id });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await fetch(CODY_URLS.DELETE_CONVERSATION(conversation.conversation_id), {
      method: "DELETE",
      headers: HEADERS,
    });

    await ConversationModel.deleteOne({ _id: id });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Request failed:", error.message);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

const deleteAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await ConversationModel.find({ user_id: userId });

    const deletePromises = conversations.map((conversation) =>
      fetch(CODY_URLS.DELETE_CONVERSATION(conversation.conversation_id), {
        method: "DELETE",
        headers: HEADERS,
      })
    );
    await Promise.all(deletePromises);

    await ConversationModel.deleteMany({ user_id: userId });

    res.status(200).json({ message: "All conversations deleted successfully" });
  } catch (error) {
    console.error("Request failed:", error.message);
    res.status(500).json({ message: "Failed to delete all conversations" });
  }
};

export {
  createConversation,
  getAllConversations,
  getConversation,
  deleteConversation,
  deleteAll,
};
