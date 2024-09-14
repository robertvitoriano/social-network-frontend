import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IMainStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useMainStore = create<IMainStore>()(
  persist(
    (set) => ({
      loading: true,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: "Chat-store",
    }
  )
);
