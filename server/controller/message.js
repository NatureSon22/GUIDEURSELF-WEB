import ConversationModel from "../models/conversation.js";
import MessageModel from "../models/message.js";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import { config } from "dotenv";

config();

const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({
      is_machine_generated: true,
      is_helpful: { $exists: true, $in: [true, false] },
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, conversation_id } = req.body;

    if (!content) {
      res.status(500).json({ message: "No content" });
    }

    if (!conversation_id) {
      res.status(500).json({ message: "No conversation_id" });
    }

    const response = await fetch(CODY_URLS.CREATE_MESSAGE(), {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ content, conversation_id }),
    });

    console.log(process.env.CODY_API_KEY);

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
    res.status(500).json({ message: "Failed to send a review", error });
  }
};

const tallyReview = async (req, res) => {
  try {
    const result = await MessageModel.aggregate([
      {
        $match: {
          is_machine_generated: true,
          is_helpful: { $in: [true, false] }, // Ensures only reviewed messages are counted
        },
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          helpfulMessages: {
            $sum: { $cond: [{ $eq: ["$is_helpful", true] }, 1, 0] },
          },
          unhelpfulMessages: {
            $sum: { $cond: [{ $eq: ["$is_helpful", false] }, 1, 0] },
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        totalMessages: 0,
        helpfulMessages: 0,
        unhelpfulMessages: 0,
        helpfulPercentage: 0,
        unhelpfulPercentage: 0,
      });
    }

    const { totalMessages, helpfulMessages, unhelpfulMessages } = result[0];

    res.status(200).json({
      totalMessages,
      helpfulMessages,
      unhelpfulMessages,
      helpfulPercentage: (helpfulMessages / totalMessages) * 100,
      unhelpfulPercentage: (unhelpfulMessages / totalMessages) * 100,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to tally review", error: error.message });
  }
};

export { sendMessage, reviewMessage, getMessages, tallyReview };
