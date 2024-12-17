import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: null,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  reset: () => set({ isAuthenticated: null }),
}));

export default useAuthStore;
