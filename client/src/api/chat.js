import supabase from "@/config/supabase";

const listenForMessages = (userId, selectedUserId, callback) => {
  const channelName =
    userId < selectedUserId
      ? `messages-${userId}-${selectedUserId}`
      : `messages-${selectedUserId}-${userId}`;

  return supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `or(and(sender_id.eq.${userId},receiver_id.eq.${selectedUserId}), and(sender_id.eq.${selectedUserId},receiver_id.eq.${userId}))`,
      },
      (payload) => {
        console.log("🔔 New message detected:", payload.new);
        callback(payload.new);
      },
    )
    .subscribe();
};

const sendMessage = async (senderId, receiverId, content, files = []) => {
  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
    .select()
    .single();

  if (messageError) return { error: messageError };

  // Upload and attach files
  const fileEntries = await Promise.all(
    files.map(async (file) => {
      const fileUrl = await uploadFile(file);
      return { message_id: message.id, file_url: fileUrl };
    }),
  );

  await supabase.from("message_files").insert(fileEntries);

  return { data: message };
};

const getMessagesBetweenUsers = async (
  userId1,
  userId2,
  limit = 50,
  offset = 0,
) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`,
    )
    .order("created_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  return { data, error };
};

const markMessagesAsRead = async (senderId, receiverId) => {
  const { data, error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("is_read", false);

  return { data, error };
};

const getUnreadMessagesCount = async (userId) => {
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact" })
    .eq("receiver_id", userId)
    .eq("is_read", false);

  return { count, error };
};

const subscribeToUsersWithUnreadMessages = (userId, campusId, callback) => {
  const fetchUsersWithLatestMessage = async () => {
    try {
      const result = await getUsersByCampus(campusId);
      const users = result.data || [];

      // Fetch the latest message for each user
      const usersWithMessages = await Promise.all(
        users.map(async (user) => {
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("receiver_id", userId)
            .eq("sender_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...user,
            latestMessage: messages.length > 0 ? messages[0] : null,
          };
        }),
      );

      callback(usersWithMessages);
    } catch (error) {
      console.error("Error fetching users with latest messages:", error);
    }
  };

  // Initial fetch
  fetchUsersWithLatestMessage();

  const subscription = supabase
    .channel("users-status-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${userId}`,
      },
      fetchUsersWithLatestMessage,
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${userId}`,
      },
      fetchUsersWithLatestMessage,
    )
    .subscribe();

  return subscription;
};

const getUsersWithUnreadMessages = async (userId, campusId) => {
  const { data: senderIds, error: senderError } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("receiver_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (senderError) return { data: null, error: senderError };

  if (senderIds && senderIds.length > 0) {
    const uniqueSenderIds = [
      ...new Set(senderIds.map((item) => item.sender_id)),
    ];

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .in("id", uniqueSenderIds)
      .eq("campus_id", campusId);

    return { data: users, error: usersError };
  }

  return { data: [], error: null };
};

const createUser = async (user) => {
  const { data, error } = await supabase.from("users").insert(user);
  return { data, error };
};

const getUserById = async (user_id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user_id)
    .single();

  return { data, error };
};

const updateUser = async (id, updates) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);

  return { data, error };
};

const deleteUser = async (id) => {
  const { data, error } = await supabase.from("users").delete().eq("id", id);

  return { data, error };
};

const getUsersByCampus = async (campusId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("campus_id", campusId);

  return { data, error };
};

const uploadFile = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("chat-files")
    .upload(fileName, file);

  if (error) {
    console.error("File upload error:", error);
    return null;
  }

  return supabase.storage.from("chat-files").getPublicUrl(fileName);
};

export {
  listenForMessages,
  sendMessage,
  getMessagesBetweenUsers,
  markMessagesAsRead,
  getUnreadMessagesCount,
  getUsersWithUnreadMessages,
  subscribeToUsersWithUnreadMessages,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByCampus,
  uploadFile,
};
