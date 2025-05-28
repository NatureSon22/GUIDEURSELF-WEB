import { getChatHeads } from "@/api/chatmessages";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useChatStore from "@/context/useChatStore";
import useSocketStore from "@/context/useSocketStore";
import useToggleTheme from "@/context/useToggleTheme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ChatSidebar = () => {
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);
  const { hasNewMessage, resetNewMessage } = useSocketStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { isDarkMode } = useToggleTheme((state) => state);

  // ✅ Fetch chat heads (without `hasNewMessage` in queryKey)
  const { data: chatHeads = [], isLoading } = useQuery({
    queryKey: ["chatHeads"],
    queryFn: getChatHeads,
  });

  // ✅ Manually refetch chat heads only when a new message arrives
  useEffect(() => {
    if (hasNewMessage) {
      console.log("Refetching chat heads...");
      queryClient.invalidateQueries(["chatHeads"]);
      resetNewMessage();
    }
  }, [hasNewMessage, queryClient, resetNewMessage]);

  // ✅ Select first chat only on initial load
  useEffect(() => {
    if (!selectedChat && chatHeads.length > 0) {
      setSelectedChat(chatHeads[0].receiver);
    }
  }, [chatHeads, selectedChat, setSelectedChat]);

  const handleChatClick = (user) => {
    setSelectedChat(user);
  };

  const filteredChats = chatHeads.filter((chat) =>
    chat.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[380px] space-y-3 overflow-y-auto border-r border-gray-200 pr-3">
      <div className="space-y-2">
        <p
          className={`text-[1.05rem] font-semibold ${isDarkMode ? "text-dark-text-base-300" : ""}`}
        >
          Active Chats
        </p>
        <Input
          type="text"
          placeholder="Search"
          className={`focus-visible:ring-0 ${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const receiver = chat.receiver || {};
            return (
              <div
                key={receiver._id}
                className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100/40 ${
                  selectedChat?._id === receiver._id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChatClick(receiver)}
              >
                <div className="size-12 overflow-hidden rounded-full border">
                  <img
                    src={receiver.user_profile || "/default-avatar.png"} // ✅ Fallback image
                    alt={`${receiver.firstname || "User"} ${
                      receiver.lastname || "Profile"
                    }`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[0.9rem] font-medium">{receiver.name}</p>
                  <p className="w-[200px] truncate text-[0.75rem] text-secondary-100/70">
                    University{" "}
                    {receiver.role_type
                      ? receiver.role_type[0].toUpperCase() +
                        receiver.role_type.slice(1)
                      : "Unknown"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="my-20 grid place-items-center">
            <p
              className={`text-sm ${isDarkMode ? "text-dark-text-base-300-75" : "text-gray-500"} `}
            >
              No chats found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
