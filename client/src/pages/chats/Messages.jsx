import useChatStore from "@/context/useChatStore";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const Messages = () => {
  const { selectedChat } = useChatStore((state) => state);

  if (!selectedChat) {
    return (
      <div className="grid h-full place-items-center">
        <div className="h-full w-full rounded-lg bg-secondary-200-60/10"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 pb-4">
        <div className="size-14 overflow-hidden rounded-full">
          <img
            src={selectedChat.user_profile}
            alt={`profile picture`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <p className="font-medium">{selectedChat.name}</p>
      </div>

      <div className="my-3 flex-1 overflow-y-auto">
        <MessageList />
      </div>

      <MessageInput />
    </div>
  );
};

export default Messages;
