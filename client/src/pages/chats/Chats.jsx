import useUserStore from "@/context/useUserStore";
import ChatSidebar from "./ChatSidebar";
import Messages from "./Messages";
import useSocketStore from "@/context/useSocketStore";
import { useEffect } from "react";

const Chats = () => {
  const { currentUser } = useUserStore((state) => state);
  const { registerUser } = useSocketStore((state) => state);

  useEffect(() => {
    if (currentUser?._id) {
      registerUser(currentUser._id);
    }
  }, [currentUser, registerUser]);

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
