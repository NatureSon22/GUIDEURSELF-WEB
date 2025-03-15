import { create } from "zustand";
import { io } from "socket.io-client";

const useSocketStore = create((set) => {
  const socket = io(import.meta.env.VITE_SOCKET_URL);

  // Handle socket events
  socket.on("connect", () => {
    console.log("Connected to socket server: ", socket.id);
    set({ socketId: socket.id });
  });

  socket.on("receiveMessage", (message) => {
      
    set((state) => ({ messages: [message, ...state.messages] }));
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
    set({ socketId: null });
  });



  return {
    socket,
    socketId: null,
    messages: [],
    
    joinRoom: (userId) => {
      if (userId) {
        socket.emit("join", userId);
        console.log(`Joined room: ${userId}`);
      }
    },

    sendMessage: ({ sender_id, receiver_id, content, files }) => {
      if (content.trim() === "" && files.length === 0) return;

      const message = { sender_id, receiver_id, content, files };
      console.log("Sending message: ", message);
      socket.emit("sendMessage", message);
    },

    setMessages: (messages) => {
      set({ messages });
    },
  };
});

export default useSocketStore;