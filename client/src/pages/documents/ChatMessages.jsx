import PropTypes from "prop-types";
import ChatLoader from "@/components/ChatLoader";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // ✅ Enable GitHub-style Markdown (lists, tables, strikethrough)

const ChatMessages = ({ messages = [], loading = false }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[600px] rounded-2xl px-5 py-4 text-[0.9rem] ${
              message.machine
                ? "mr-auto bg-base-300/10 text-black"
                : "ml-auto bg-base-200 text-white"
            }`}
          >
            {/* ✅ Support better Markdown rendering */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        ))
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-secondary-100-75">No messages yet</p>
        </div>
      )}

      {loading && <ChatLoader />}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.array,
  loading: PropTypes.bool,
};

export default ChatMessages;