import { getMessages } from "@/api/chatmessages";
import useChatStore from "@/context/useChatStore";
import useSocketStore from "@/context/useSocketStore";
import useUserStore from "@/context/useUserStore";
import formatDate from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const MessageList = () => {
  const { currentUser } = useUserStore((state) => state);
  const { selectedChat } = useChatStore((state) => state);
  const { joinRoom, messages, setMessages } = useSocketStore();
  const messagesEndRef = useRef(null);

  const { data: messagelist, isLoading } = useQuery({
    queryKey: ["chat-messages", selectedChat._id],
    queryFn: () => getMessages(selectedChat._id),
    enabled: !!selectedChat._id,
  });

  useEffect(() => {
    if (!isLoading && messagelist) {
      setMessages(messagelist);
    }
  }, [isLoading, messagelist, setMessages]);

  useEffect(() => {
    if (currentUser?._id && selectedChat?._id) {
      joinRoom(currentUser._id, selectedChat._id);
    }
  }, [currentUser, selectedChat, joinRoom]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col-reverse gap-4 overflow-y-auto px-4 py-6">
      <div ref={messagesEndRef} />

      {messages.map((message) => (
        <div
          key={message.createdAt}
          className={`flex ${
            message.sender_id === currentUser._id
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`w-max max-w-[60%] px-4 py-3 ${
              message.sender_id === currentUser._id
                ? "rounded-l-2xl rounded-tr-2xl bg-base-200/25"
                : "rounded-r-2xl rounded-tl-2xl border border-secondary-100-75/20 bg-white"
            }`}
          >
            {/* Display text message */}
            {message.content && (
              <p className="text-sm leading-6">{message.content}</p>
            )}

            {/* Display files (images or links) */}
            {message.files &&
              message.files.map((file, index) => (
                <div key={index} className="mt-2">
                  {file.type === "img" ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-lg shadow-md transition-transform duration-200"
                    >
                      <img
                        src={file.url}
                        alt="Sent image"
                        className="max-h-60 max-w-xs object-cover"
                      />
                    </a>
                  ) : (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-500 transition-colors duration-200 hover:bg-blue-100"
                    >
                      <span role="img" aria-label="File">
                        📄
                      </span>
                      <span>View File</span>
                    </a>
                  )}
                </div>
              ))}

            <span className="mt-3 block text-right text-xs text-secondary-100-75/60">
              {formatDate(message.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
