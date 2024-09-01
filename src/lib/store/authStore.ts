import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LoggedUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  cover: string;
};

interface IAuthStore {
  loggedUser: LoggedUser;
  token: string;
  rehydrated: boolean;
  setLoggedUser: (loggedUser: LoggedUser) => void;
  setToken: (token: string) => void;
  setRehydrated: (rehydrated: boolean) => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist<IAuthStore>(
    (set) => ({
      loggedUser: {
        id: "",
        name: "",
        email: "",
        username: "",
        avatar: "",
        cover: "",
      },
      token: "",
      rehydrated: false,
      setLoggedUser: (loggedUser: LoggedUser) =>
        set(() => ({
          loggedUser,
        })),
      setToken: (token: string) =>
        set(() => ({
          token,
        })),
      setRehydrated: (rehydrated: boolean) =>
        set(() => ({
          rehydrated,
        })),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setRehydrated(true);
      },
    }
  )
);
