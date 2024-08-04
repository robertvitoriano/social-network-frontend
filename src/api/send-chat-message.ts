import { api } from "./api";

export async function sendChatMessage(receiverId: string, content: string) {
  const chatMessageResponse = await api.post("/chat/send-message", {
    receiverId,
    content,
  });
  return chatMessageResponse;
}
