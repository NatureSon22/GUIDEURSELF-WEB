import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { useQuery } from "@tanstack/react-query";
import { createConversation } from "@/api/test-chat.js";
import { useState } from "react";

const TestChat = () => {
  const { data: conversationId, isLoading: creatingConversation } = useQuery({
    queryKey: ["conversationId"],
    queryFn: createConversation,
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  if (creatingConversation) {
    return <div></div>;
  }

  return (
    <div className="mx-10 my-5 flex flex-1 flex-col gap-10 overflow-hidden">
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput conversationId={conversationId} setMessages={setMessages} setLoading={setLoading} />
    </div>
  );
};

export default TestChat;
