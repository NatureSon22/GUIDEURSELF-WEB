import { getChatHeads } from "@/api/message";
import { Input } from "@/components/ui/input";
import useChatStore from "@/context/useChatStore";
import useUserStore from "@/context/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ChatSidebar = () => {
  const { data: chatHeads } = useQuery({
    queryKey: ["chatHeads"],
    queryFn: getChatHeads
  })
  const { currentUser } = useUserStore((state) => state);
  const [users, setUsers] = useState([]);
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);

  const handleChatClick = (user) => {
    setSelectedChat(user);
  };

  return (
    <div className="w-full max-w-[380px] space-y-3 overflow-y-auto border-r border-gray-200 pr-3">
      <div className="space-y-2">
        <p className="text-[1.05rem] font-semibold">Active Chats</p>
        <Input
          type="text"
          placeholder="Search"
          className="bg-white focus-visible:ring-0"
        />
      </div>

      <div>
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${selectedChat?.id === user.id ? "bg-gray-100" : ""}`}
            onClick={() => handleChatClick(user)}
          >
            {/* User Image */}
            <div className="size-12 overflow-hidden rounded-full border">
              <img
                src={user.user_photo_url}
                alt={`${user.firstname} ${user.lastname} profile picture`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <p className="text-[0.9rem] font-medium">
                {user.firstname + " " + user.lastname}
              </p>
              <p className="w-[200px] truncate text-[0.75rem] text-secondary-100/70">
                {user.message}
              </p>
            </div>

            {/* Time */}

            <p className="mb-5 w-max text-end text-[0.75rem] font-medium text-secondary-100/40">
              {user.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
