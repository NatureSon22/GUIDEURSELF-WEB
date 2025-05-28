import PropTypes from "prop-types";
import ChatLoader from "@/components/ChatLoader";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useToggleTheme from "@/context/useToggleTheme";

const ChatMessages = ({ messages = [], loading = false }) => {
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useToggleTheme((state) => state);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={`prose prose-xs max-w-[600px] rounded-[19px] px-5 pb-1 pt-4 text-[0.85rem] ${
              message.machine
                ? isDarkMode
                  ? "mr-auto bg-dark-secondary-200 text-dark-text-base-300"
                  : "mr-auto bg-base-300/10 text-black"
                : "ml-auto bg-base-200 text-white"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              // when isDarkMode is true i want other fontcolor
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-3 mt-2 text-lg font-bold">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 mt-3 text-base font-semibold">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-2 text-sm font-medium">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3 text-[0.85rem] leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 ml-4 list-disc space-y-1 text-[0.85rem]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 ml-4 list-decimal space-y-1 text-[0.85rem]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="ml-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-current pl-3 text-[0.85rem] italic">
                    {children}
                  </blockquote>
                ),
                pre({ children }) {
                  return (
                    <pre className="overflow-x-auto rounded bg-black/20 p-3 text-xs">
                      {children}
                    </pre>
                  );
                },

                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {children}
                    </a>
                  );
                },
                table: ({ children }) => (
                  <div className="my-3 overflow-x-auto">
                    <table className="w-full border-collapse text-[0.85rem]">
                      {children}
                    </table>
                  </div>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ))
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p
            className={` ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100-75"} `}
          >
            Start messaging . . .
          </p>
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
