import ConversationModel from "../models/conversation.js";
import MessageModel from "../models/message.js";
import classifyText from "../service/textClassify.js";
import { CODY_URLS, HEADERS } from "./rag-endpoints.js";
import { config } from "dotenv";

config();

const getMessages = async (req, res) => {
  try {
    // Fetch messages from DB
    // const messages = await MessageModel.find().sort({ createdAt: 1 }); // Ensure proper order

    // const formattedMessages = [];
    // let currentPair = {};

    // messages.forEach((msg) => {
    //   if (!msg.is_machine_generated) {
    //     // User's query
    //     currentPair = { message: msg };
    //   } else {
    //     // Machine-generated response
    //     currentPair.response = msg;
    //     formattedMessages.push(currentPair); // Push the completed pair
    //     currentPair = {}; // Reset for next pair
    //   }
    // });

    const messages = await MessageModel.find({
      is_machine_generated: true,
      is_helpful: { $exists: true, $in: [true, false] },
    }).sort({
      date_added: -1,
    });

    //res.status(200).json(messages);

    res.status(200).json({ messages });
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
      body: JSON.stringify({ content: `WEB: ${content}`, conversation_id }),
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

    // const classification = await classifyText(responseContent);
    // console.log(classification);

    const userMessage = await MessageModel.create({
      content,
      is_machine_generated: false,
    });

    const botMessage = await MessageModel.create({
      content: responseContent,
      is_machine_generated: true,
      //category: classification.text_classification.category,
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
    const { id, is_helpful, reason } = req.body;

    const fields = {};

    if (typeof is_helpful === "boolean") fields.is_helpful = is_helpful;
    if (reason) fields.reason = reason;

    await MessageModel.updateOne({ _id: id }, { $set: fields }, { new: true });

    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ message: "Failed to send a review", error });
  }
};

const tallyReview = async (req, res) => {
  const { filter } = req.query;
  console.log("filter: " + filter);
  console.log("run");

  const now = new Date();
  let startDate = null;

  switch (filter) {
    case "Today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "This week": {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      break;
    }
    case "This month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "This year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "none":
    default:
      // If no filter is provided, do not filter by date
      startDate = null;
      break;
  }

  try {
    const matchStage = {
      is_machine_generated: true,
      is_helpful: { $in: [true, false] },
    };

    if (startDate !== null) {
      matchStage.date_added = { $gte: startDate };
    }

    const result = await MessageModel.aggregate([
      {
        $match: matchStage,
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
    res.status(500).json({
      message: "Failed to tally review",
      error: error.message,
    });
  }
};

export { sendMessage, reviewMessage, getMessages, tallyReview };
