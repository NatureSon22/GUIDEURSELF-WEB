import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import ChatLoader from "@/components/ChatLoader";
import { useEffect, useRef } from "react";

const ChatMessages = ({ messages = [], loading = false }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="gap flex flex-1 flex-col place-content-start gap-4 overflow-y-auto px-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[600px] rounded-xl px-4 py-3 text-[0.9rem] ${
              message.machine
                ? "mr-auto bg-base-300/10"
                : "ml-auto bg-base-200 text-white"
            }`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(message.content),
            }}
          ></div>
        ))
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-center text-secondary-100-75">No messages yet</p>
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
