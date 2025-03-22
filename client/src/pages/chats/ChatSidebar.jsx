import { getChatHeads } from "@/api/chatmessages";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useChatStore from "@/context/useChatStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ChatSidebar = () => {
  const { data: chatHeads = [], isLoading } = useQuery({
    queryKey: ["chatHeads"],
    queryFn: getChatHeads,
  });
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (chatHeads.length > 0) {
      setSelectedChat(chatHeads[0].receiver);
    }
  }, [chatHeads, setSelectedChat]);

  const handleChatClick = (user) => {
    setSelectedChat(user);
  };

  const filteredChats = chatHeads.filter((chat) =>
    chat.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[380px] space-y-3 overflow-y-auto border-r border-gray-200 pr-3">
      <div className="space-y-2">
        <p className="text-[1.05rem] font-semibold">Active Chats</p>
        <Input
          type="text"
          placeholder="Search"
          className="bg-white focus-visible:ring-0"
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
                    src={receiver.user_profile}
                    alt={`${receiver.firstname} ${receiver.lastname} profile picture`}
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
            <p className="text-sm text-gray-500">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
