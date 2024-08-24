import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listNonFriends } from "@/api/list-non-friends";
import { useMainStore } from "./mainStore";
import { listUserFriends } from "@/api/list-user-frients";

export interface FriendSuggestion {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
  friendshipRequestStatus: string;
  avatar: string;
  created_at: string;
}

export interface IUserFriend {
  friendshipId: string;
  lastMessageCreatedAt: string | number | Date;
  lastMessage: string;
  online: boolean;
  id: string;
  name: string;
  avatar: string;
}

interface IFriendshipStore {
  rehydrated: boolean;
  friendsSuggestions: FriendSuggestion[];
  userFriends: IUserFriend[];
  setFriendsSuggestions: (friendsSuggestions: FriendSuggestion[]) => void;
  setUserFriends: (userFriends: IUserFriend[]) => void;
  fetchFriendshipSugestions: () => Promise<void>;
  fetchUserFriends: () => Promise<void>;
}

export const useFriendshipStore = create<IFriendshipStore>()(
  persist<IFriendshipStore>(
    (set) => ({
      rehydrated: false,
      friendsSuggestions: [],
      userFriends: [],
      setFriendsSuggestions: (friendsSuggestions: FriendSuggestion[]) =>
        set(() => ({
          friendsSuggestions,
        })),
      setUserFriends: (userFriends: IUserFriend[]) =>
        set(() => ({
          userFriends,
        })),
      fetchFriendshipSugestions: async () => {
        const { setLoading } = useMainStore.getState();

        try {
          setLoading(true);
          const response = await listNonFriends();
          set({ friendsSuggestions: response.data.nonFriends });
        } catch (error) {
          console.error("Error fetching friends suggestions:", error);
        } finally {
          setLoading(false);
        }
      },
      fetchUserFriends: async () => {
        const { setLoading } = useMainStore.getState();

        try {
          setLoading(true);
          const response = await listUserFriends();
          set({ userFriends: response.data.userFriends });
        } catch (error) {
          console.error("Error fetching user friends:", error);
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "friendship-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
