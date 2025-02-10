import { useState, useEffect, useRef } from "react";

const StreamChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef(null); // Persist SSE connection across renders

  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsStreaming(true);

    try {
      const response = await fetch("https://getcody.ai/api/v1/messages/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 91qUIEnTkzIgGXx2LGAlj31Bmf8JcUQ3KcmQ0TUC676ecc50`,
          credentials: "include",
        },
        body: JSON.stringify({
          content: input,
          conversation_id: "N1aM886nGeWm",
          redirect: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch stream URL");

      const data = await response.json();
      const streamUrl = data.data?.stream_url;

      if (!streamUrl) throw new Error("Stream URL not found");

      eventSourceRef.current = new EventSource(streamUrl);

      eventSourceRef.current.onmessage = (event) => {
        const data = event.data;

        if (data === "[END]") {
          eventSourceRef.current.close();
          setIsStreaming(false);
        } else if (data !== "[START]") {
          const chunk = JSON.parse(data).chunk;

          setMessages((prev) => {
            const lastMessage = prev.length > 0 ? prev[prev.length - 1] : "";
            return [...prev.slice(0, -1), lastMessage + chunk]; // Append to last message
          });
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSourceRef.current.close();
        setIsStreaming(false);
      };
    } catch (error) {
      console.error("Error:", error);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h2>AI Chat</h2>
      <div style={{ height: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.length > 0 ? messages.map((msg, i) => <p key={i}>{msg}</p>) : <p>No messages yet</p>}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type a message..." 
        disabled={isStreaming} 
      />
      <button onClick={sendMessage} disabled={isStreaming}>Send</button>
    </div>
  );
};

export default StreamChat;