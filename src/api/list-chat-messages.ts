import { api } from "./api";

export async function listChatMessagesByUser(friendId: string) {
  const chatMessages = await api.get(`/chat/list/${friendId}`);
  return chatMessages;
}
