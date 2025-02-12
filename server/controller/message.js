import ConversationModel from "../models/conversation.js";
import MessageModel from "../models/message.js";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";

const sendMessage = async (req, res) => {
  try {
    const { content, conversation_id } = req.body;

    const response = await fetch(CODY_URLS.CREATE_MESSAGE(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ content, conversation_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        message: "Failed to send message",
        error: errorData.error || "An unknown error occurred",
      });
    }

    const {
      data: { id: responseId, content: responseContent, machine },
    } = await response.json();

    const userMessage = await MessageModel.create({
      content,
      is_machine_generated: false,
    });

    const botMessage = await MessageModel.create({
      content: responseContent,
      is_machine_generated: true,
    });

    // Update conversation with new messages (appending instead of replacing)
    await ConversationModel.findOneAndUpdate(
      { conversation_id },
      { $push: { messages: { $each: [userMessage._id, botMessage._id] } } },
      { new: true }
    );

    res.status(200).json({
      answer: {
        id: botMessage._id,
        content: responseContent,
        machine,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

const reviewMessage = async (req, res) => {
  try {
    const { id, is_helpful } = req.body;

    await MessageModel.updateOne(
      { _id: id },
      { $set: { is_helpful } },
      { new: true }
    );

    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export { sendMessage, reviewMessage };
