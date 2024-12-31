import { create } from "zustand";

const useDialogStore = create((set) => ({
  isOpen: false,
  dialogData: null,
  setDialogData: (dialogData) => set({ dialogData }),
  setOpenDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useDialogStore;
