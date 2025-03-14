import MessageChatModel from "../models/messagechat.js";
import RoleModel from "../models/role.js";
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

    // Fetch chat messages between sender and receiver
    const messages = await MessageChatModel.find({
      $or: [
        { sender_id, receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    }).sort({ timestamp: -1 }); // Ensure timestamp field is indexed
    // .limit(100) // Optional: Prevent fetching too many messages
    // .populate({
    //   path: "sender_id",
    //   populate: { path: "role_id" },
    //   select: "firstname lastname email user_photo_url role_type",
    // })
    // .populate({
    //   path: "receiver_id",
    //   populate: { path: "role_id" },
    //   select: "firstname lastname email user_photo_url role_type",
    // })
    //.populate("files");

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("❌ Error fetching chat messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const chatHeads = async (req, res) => {
  try {
    const { userId, campusId, roleId } = req.user;
    const role = await RoleModel.findById(roleId);
    const userRole = role.role_type.toLowerCase();

    let receivers;

    if (userRole === "super administrator") {
      receivers = await UserModel.find({ _id: { $ne: userId } }).populate(
        "role_id"
      );
    } else if (userRole === "student") {
      receivers = await UserModel.find({
        campus_id: campusId,
        _id: { $ne: userId },
        "role_id.role_type": { $ne: "student" },
      }).populate("role_id");
    } else {
      receivers = await UserModel.find({
        campus_id: campusId,
        _id: { $ne: userId },
        role_id: { $ne: roleId },
      }).populate("role_id");
    }

    const receiverIds = receivers.map((receiver) => receiver._id);

    // Fetch latest messages and unread count
    const chatMessages = await MessageChatModel.aggregate([
      {
        $match: {
          $or: [
            { sender_id: userId, receiver_id: { $in: receiverIds } },
            { sender_id: { $in: receiverIds }, receiver_id: userId },
          ],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $gt: ["$sender_id", "$receiver_id"] },
              then: ["$sender_id", "$receiver_id"],
              else: ["$receiver_id", "$sender_id"],
            },
          },
          latestMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver_id", userId] },
                    { $eq: ["$status", "sent"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const chatMap = new Map();
    chatMessages.forEach((chat) => {
      const chatPartnerId =
        chat.latestMessage.sender_id.toString() === userId
          ? chat.latestMessage.receiver_id.toString()
          : chat.latestMessage.sender_id.toString();
      chatMap.set(chatPartnerId, {
        ...chat.latestMessage,
        unreadCount: chat.unreadCount,
      });
    });

    const chatHeads = receivers.map((receiver) => {
      const receiverId = receiver._id.toString();
      const lastMessage = chatMap.get(receiverId);

      return {
        _id: lastMessage ? lastMessage._id : null,
        content: lastMessage ? lastMessage.content : null,
        timestamp: lastMessage ? lastMessage.timestamp : null,
        unreadCount: lastMessage ? lastMessage.unreadCount : 0,
        sender: { _id: userId },
        receiver: {
          _id: receiver._id,
          name: `${receiver.firstname} ${receiver.lastname}`,
          user_profile: receiver.user_photo_url,
          role_type: receiver.role_id?.role_type || "Unknown",
        },
      };
    });

    res.status(200).json({ chatHeads });
  } catch (error) {
    console.error("Error fetching chat heads:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver_id, content, files } = req.body;
    const sender_id = req.user.userId;

    if (!receiver_id || (!content && (!files || files.length === 0))) {
      return res
        .status(400)
        .json({ message: "Message content or files are required" });
    }

    // Create and save the message
    const newMessage = new MessageChatModel({
      sender_id,
      receiver_id,
      content: content || "",
      files: files || [],
      status: "sent",
      timestamp: new Date(),
    });

    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getChatMessages, chatHeads, sendMessage };
