import MessageChatModel from "../models/messagechat.js";
import UserModel from "../models/user.js";

const getChatMessages = async (req, res) => {
  try {
    const { receiver_id } = req.query;
    const sender_id = req.user?.userId;

    if (!sender_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!receiver_id) {
      return res.status(400).json({ message: "receiver_id is required" });
    }

    const messages = await MessageChatModel.find({
      $or: [
        { sender_id, receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    })
      .sort({ timestamp: 1 })
      .populate({
        path: "sender_id",
        populate: { path: "role_id" },
        select: "firstname lastname email user_photo_url role_type",
      })
      .populate({
        path: "receiver_id",
        populate: { path: "role_id" },
        select: "firstname lastname email user_photo_url role_type",
      })
      .populate("files");

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const chatHeads = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const campusId = req.user?.campusId;

    if (!userId || !campusId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Step 1: Get previous chat partners (sorted by latest message)
    let chatHeads = await MessageChatModel.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    })
      .sort({ timestamp: -1 }) // Newest messages first
      .populate({
        path: "sender_id receiver_id",
        select: "firstname lastname email user_photo_url role_type campusId",
      });

    // Use a Map to store only unique non-student users from the same campus
    const chatHeadsMap = new Map();

    chatHeads.forEach((msg) => {
      let chatPartner =
        msg.sender_id._id.toString() !== userId
          ? msg.sender_id
          : msg.receiver_id;

      if (
        chatPartner.role_type.toLowerCase() !== "student" &&
        chatPartner.campusId === campusId
      ) {
        chatHeadsMap.set(chatPartner._id.toString(), {
          ...chatPartner.toObject(),
          lastMessageTimestamp: msg.timestamp,
        });
      }
    });

    // If Case 1 has no results, move to Case 2
    if (chatHeadsMap.size === 0) {
      const nonStudentUsers = await UserModel.find({
        campusId: campusId,
        role_type: { $ne: "student" }, // Exclude students
        _id: { $ne: userId }, // Exclude current user
      }).select("firstname lastname email user_photo_url role_type campusId");

      nonStudentUsers.forEach((user) => {
        chatHeadsMap.set(user._id.toString(), {
          ...user.toObject(),
          lastMessageTimestamp: null, // No chat history
        });
      });
    }

    // Convert map to array and sort (if messages exist, sort by latest message)
    const chatHeadsList = Array.from(chatHeadsMap.values()).sort((a, b) => {
      if (!a.lastMessageTimestamp) return 1; // Move users with no messages to the bottom
      if (!b.lastMessageTimestamp) return -1;
      return b.lastMessageTimestamp - a.lastMessageTimestamp;
    });

    res.status(200).json({ chatHeads: chatHeadsList });
  } catch (error) {
    console.error("Error fetching chat heads:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getChatMessages, chatHeads };
