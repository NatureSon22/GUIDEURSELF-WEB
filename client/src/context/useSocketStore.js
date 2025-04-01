import { create } from "zustand";
import { io } from "socket.io-client";

const useSocketStore = create((set, get) => {
  const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: true });

  socket.on("connect", () => {
    set({ socketId: socket.id });
  });

  socket.on("receiveMessage", (message) => {
    set((state) => ({ messages: [message, ...state.messages] }));
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
    set({ socketId: null, messages: [], currentRoom: null });
  });

  socket.on("hasNewMessage", () => {
    console.log("New message received");
    set({ hasNewMessage: true });
  });

  return {
    socket,
    socketId: null,
    messages: [],
    currentRoom: null,
    hasNewMessage: false,

    registerUser: (userId) => {
      socket.emit("registerUser", userId);
    },

    /** ✅ Join a room based on user pair, leaving the previous one */
    joinRoom: (userId, otherUserId) => {
      const state = get();
      const newRoomId = [userId, otherUserId].sort().join("_");

      if (state.currentRoom && state.currentRoom !== newRoomId) {
        socket.emit("leave", { roomId: state.currentRoom });
      }

      socket.emit("join", { userId, otherUserId });

      set({ currentRoom: newRoomId });
    },

    /** ✅ Send a message */
    sendMessage: ({ sender_id, receiver_id, content, files = [] }) => {
      if (!socket.connected) {
        console.warn("Socket is not connected, cannot send message.");
        return;
      }
      if (content.trim() === "" && files.length === 0) return;

      const message = { sender_id, receiver_id, content, files };
      socket.emit("sendMessage", message);
    },

    /** ✅ Set messages manually */
    setMessages: (messages) => {
      set({ messages });
    },

    disconnect: () => {
      console.log("Disconnecting socket...");
      socket.removeAllListeners();
      socket.disconnect();
      set({ socketId: null, messages: [], currentRoom: null });
    },

    resetNewMessage: () => {
      set({ hasNewMessage: false });
    },
  };
});

export default useSocketStore;
