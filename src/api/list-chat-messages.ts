import { api } from "./api";

export async function listChatMessagesByUser(
  friendId: string,
  currentPage: number
) {
  const chatMessages = await api.get(
    `/chat/list/${friendId}?page=${currentPage}`
  );
  return chatMessages;
}
