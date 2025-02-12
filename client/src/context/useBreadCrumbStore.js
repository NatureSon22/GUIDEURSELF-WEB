import { create } from "zustand";

const useBreadCrumbStore = create((set) => ({
  crumbs: [],
  addPath: ({ label, path }) =>
    set((state) => ({
      crumbs: [...state.crumbs, { label, path }],
    })),
  setPath: (paths) =>
    set(() => ({
      crumbs: paths,
    })),
}));

export default useBreadCrumbStore;
