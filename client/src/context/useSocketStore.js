import { create } from "zustand";
import { io } from "socket.io-client";
const useSocketStore = create((set, get) => {
  const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: true });
  console.log(import.meta.env.VITE_SOCKET_URL);

  socket.on("connect", () => {
    console.log("Connected to socket server: ", socket.id);
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
    console.log("Has new message");
  });

  return {
    socket,
    socketId: null,
    messages: [],
    currentRoom: null, // Track current room

    /** ✅ Join a room based on user pair, leaving the previous one */
    joinRoom: (userId, otherUserId) => {
      const state = get();
      const newRoomId = [userId, otherUserId].sort().join("_");

      if (state.currentRoom) {
        console.log(`Leaving room: ${state.currentRoom}`);
        socket.emit("leave", { roomId: state.currentRoom });
      }

      console.log(`Joining room: ${newRoomId}`);
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
      console.log("Sending message: ", message);
      socket.emit("sendMessage", message);
    },

    /** ✅ Set messages manually */
    setMessages: (messages) => {
      set({ messages });
    },

    /** ✅ Properly handle disconnection */
    disconnect: () => {
      console.log("Disconnecting socket...");
      socket.removeAllListeners();
      socket.disconnect();
      set({ socketId: null, messages: [], currentRoom: null });
    },
  };
});

export default useSocketStore;
