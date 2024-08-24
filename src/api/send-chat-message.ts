import { api } from "./api";
type messageParams = {
  receiverId: string;
  content: string;
  friendshipId: string;
};

export async function sendChatMessage({
  receiverId,
  content,
  friendshipId,
}: messageParams): Promise<any> {
  const chatMessageResponse = await api.post("/chat/send-message", {
    friendshipId,
    receiverId,
    content,
  });
  return chatMessageResponse;
}
