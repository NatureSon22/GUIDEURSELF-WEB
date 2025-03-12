import { getMessagesBetweenUsers, listenForMessages } from "@/api/chat";
import supabase from "@/config/supabase";
import useChatStore from "@/context/useChatStore";
import useUserStore from "@/context/useUserStore";
import { useEffect, useRef, useState } from "react";

const MessageList = () => {
  const { currentUser } = useUserStore((state) => state);
  const { selectedChat } = useChatStore((state) => state);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !selectedChat?.id) return;

    const fetchMessages = async () => {
      const { data, error } = await getMessagesBetweenUsers(
        currentUser.userid,
        selectedChat.id,
      );

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      console.log("Fetched messages:", data);
      setMessages(data || []);
    };

    fetchMessages();
  }, [currentUser, selectedChat?.id]);

  useEffect(() => {
    if (!currentUser || !selectedChat?.id) return;

    const subscription = listenForMessages(
      currentUser.userid,
      selectedChat.id,
      (newMessage) => {
        console.log("New message received:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      },
    );

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [currentUser, selectedChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col-reverse gap-4 overflow-y-auto px-4 py-6">
      <div ref={messagesEndRef} />

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender_id === currentUser.userid
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`w-max max-w-[60%] px-4 py-3 ${
              message.sender_id === currentUser.userid
                ? "rounded-l-2xl rounded-tr-2xl border border-secondary-100-75/20 bg-white"
                : "rounded-r-2xl rounded-tl-2xl bg-base-200/25"
            }`}
          >
            <p className="text-sm leading-6">{message.content}</p>
            <span
              className={
                "mt-3 block text-right text-xs text-secondary-100-75/60"
              }
            >
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
