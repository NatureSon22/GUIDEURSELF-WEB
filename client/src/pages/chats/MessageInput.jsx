import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";
import { AiOutlinePaperClip } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { sendMessage, uploadFile } from "@/api/chat";
import useChatStore from "@/context/useChatStore";
import useUserStore from "@/context/useUserStore";

const MessageInput = () => {
  const { selectedChat } = useChatStore((state) => state);
  const { currentUser } = useUserStore((state) => state);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const { mutateAsync: handleSendMessage } = useMutation({
    mutationFn: ({ content, file_urls }) =>
      sendMessage(currentUser.userid, selectedChat.id, content, file_urls),
  });

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    event.target.value = "";

    const newPreviews = selectedFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setFiles((prev) => [...prev, ...selectedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));

    // Remove preview if it's an image
    setImagePreviews((prev) =>
      prev.filter((preview) => preview.file !== fileToRemove),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return; // Prevent empty messages

    let fileUrls = [];
    if (files.length > 0) {
      fileUrls = await Promise.all(files.map(uploadFile));
    }

    await handleSendMessage({
      content: message.trim(), // Remove unnecessary spaces
      file_urls: fileUrls.filter(Boolean),
    });

    setMessage("");
    setFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className="flex w-full flex-col">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-t-lg bg-gray-50 p-3">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative rounded-md bg-white p-2 shadow-sm"
            >
              <img
                src={preview.url}
                alt="Attachment Preview"
                className="h-16 w-16 rounded-md object-cover"
              />
              <button
                onClick={() => removeFile(preview.file)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-red-500 shadow hover:text-red-700"
              >
                <MdClose className="text-sm" />
              </button>
            </div>
          ))}

          {files
            .filter((file) => !file.type.startsWith("image/"))
            .map((file, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-md"
              >
                <FaFileAlt className="text-lg text-base-100" />
                <span className="max-w-xs truncate text-sm text-gray-700">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  onClick={() => removeFile(file)}
                  className="text-accent-100"
                >
                  <MdClose className="text-lg" />
                </button>
              </div>
            ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={"relative flex items-center gap-3 p-2 shadow-md"}
      >
        <div
          className={`bo flex flex-1 items-center gap-3 border border-gray-300 bg-white px-4 py-3 transition-all ${
            isMultiline ? "rounded-lg" : "rounded-full"
          }`}
        >
          <TextareaAutosize
            maxRows={3}
            className="w-full resize-none bg-transparent px-3 py-2 text-[0.9rem] focus:outline-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsMultiline(e.target.value.includes("\n"));
            }}
          />

          <label className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-700">
            <AiOutlinePaperClip className="text-2xl text-base-200" />
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
            />
          </label>
        </div>

        <Button
          className="size-10 rounded-full bg-base-200"
          type="submit"
          disabled={!message && files.length === 0}
        >
          <IoSend className="text-xl" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
