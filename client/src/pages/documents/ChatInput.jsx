import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createMessage } from "@/api/test-chat";
import PropTypes from "prop-types";
import { IoSend } from "react-icons/io5";
import useToggleTheme from "@/context/useToggleTheme";

const ChatInput = ({ conversationId, setMessages, setLoading }) => {
  const [query, setQuery] = useState("");
  const { isDarkMode } = useToggleTheme((state) => state);
  const { mutateAsync: handleChat, isPending } = useMutation({
    mutationFn: (userQuery) => createMessage(conversationId, userQuery),
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data]);
      setLoading(false);
    },
    onError: () => {
      setMessages((prev) => prev.filter((message) => message.id !== "loading"));
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), content: "Failed to send message", machine: true },
      ]);
      setLoading(false);
    },
  });

  const handleSendMessage = async () => {
    const userQuery = query.trim();
    if (!query.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), content: query, machine: false },
    ]);

    setQuery("");
    setLoading(true);
    await handleChat(`Web Query: ${userQuery}`);
  };

  const handleInputChange = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
      return;
    }

    setQuery(e.target.value);
  };

  return (
    <div
      className={`flex gap-2 rounded-lg border p-3 ${isDarkMode ? "border-dark-text-base-300-75" : "border-secondary-100/40"}`}
    >
      <TextareaAutosize
        maxRows={4}
        value={query}
        onChange={handleInputChange}
        className={`w-full resize-none py-[0.3rem] focus-within:outline-none ${isDarkMode ? "bg-dark-base-bg text-dark-text-base-300" : ""} transition-colors duration-150`}
        disabled={isPending}
      />
      <Button
        className={` ${isDarkMode ? "bg-base-200 text-white" : ""} `}
        disabled={isPending || !query.trim()}
        onClick={handleSendMessage}
      >
        {isPending ? "Sending..." : "Send"} <IoSend />
      </Button>
    </div>
  );
};

ChatInput.propTypes = {
  conversationId: PropTypes.string.isRequired,
  setMessages: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ChatInput;
