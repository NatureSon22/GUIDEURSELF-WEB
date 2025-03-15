import { create } from "zustand";
const useUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
  reset: () => set({ currentUser: null }),
}));

export default useUserStore;
