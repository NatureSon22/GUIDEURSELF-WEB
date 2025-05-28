import { create } from "zustand";

const useToggleTheme = create((set) => ({
  isDarkMode: false,
  setIsDarkMode: (value) => set({ isDarkMode: value }),
}));

export default useToggleTheme;
