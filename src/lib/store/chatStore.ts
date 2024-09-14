import { create } from "zustand";

interface IChatStore {
  isChatDialogOpen: boolean;
  friendshipId: string;
  friendId: string;
  openChatDialog: (friendId: string, friendshipId: string) => void;
  closeChatDialog: () => void;
}

export const useChatStore = create<IChatStore>()((set) => ({
  isChatDialogOpen: false,
  friendshipId: "",
  friendId: "",
  openChatDialog: (friendId: string, friendshipId: string) => set({ isChatDialogOpen: true, friendId, friendshipId }),
  closeChatDialog: () => set({ isChatDialogOpen: false, friendshipId: "" }),
}));
