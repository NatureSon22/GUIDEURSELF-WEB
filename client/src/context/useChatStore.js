import { create } from "zustand";

const useChatStore = create((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  reset: () => set({ selectedChat: null }),
}));

export default useChatStore;
