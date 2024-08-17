import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listNonFriends } from "@/api/list-non-friends";

interface FriendSugestion {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
  friendshipRequestStatus: string;
  avatar: string;
  created_at: string;
}

interface IFriendshipStore {
  rehydrated: boolean;
  friendsSugestions: FriendSugestion[];
  setFriendsSugestions: (friendsSugestions: FriendSugestion[]) => void;
  fetchFriendshipSugestions: () => Promise<void>;
}

export const useFriendshipStore = create<IFriendshipStore>()(
  persist<IFriendshipStore>(
    (set) => ({
      rehydrated: false,
      friendsSugestions: [],
      setFriendsSugestions: (friendsSugestions: FriendSugestion[]) =>
        set(() => ({
          friendsSugestions,
        })),
      fetchFriendshipSugestions: async () => {
        try {
          const response = await listNonFriends();
          set({ friendsSugestions: response.data.nonFriends });
        } catch (error) {
          console.error("Error fetching friends suggestions:", error);
        }
      },
    }),
    {
      name: "friendship-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
