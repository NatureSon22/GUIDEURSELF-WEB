import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import { config } from "dotenv";

config();

const createConversation = async (req, res) => {
  try {
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
      data: { id },
    } = await response.json();

    res.status(200).json({ conversation_id: id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { conversation_id, message } = req.body;

    console.log(conversation_id, message);

    const response = await fetch(CODY_URLS.CREATE_MESSAGE(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ content: message, conversation_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        message:
          errorData.message || "Unable to send the message. Please try again.",
        error: errorData.error || "An unknown error occurred.",
      });
    }

    const { data } = await response.json();
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({
      message:
        "An internal server error occurred while processing your request.",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const response = await fetch(CODY_URLS.GET_MESSAGE(), {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Failed to fetch messages" });
    }

    const { data } = await response.json();

    const messages = data.filter(
      (message) => message.conversation_id === conversationId
    );

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createConversation, createMessage, getMessages };
