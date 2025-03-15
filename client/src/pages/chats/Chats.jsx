import ChatSidebar from "./ChatSidebar";
import Messages from "./Messages";

const Chats = () => {
  return (
    <div className="flex h-full gap-5 overflow-hidden">
      <ChatSidebar />

      <div className="grid h-full flex-1">
        <Messages />
      </div>
    </div>
  );
};

export default Chats;
