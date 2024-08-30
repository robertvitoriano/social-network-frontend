import { api } from "./api";

export async function togglePostLike(postId: string): Promise<any> {
  const chatMessageResponse = await api.post("/feed/likes", { postId });
  return chatMessageResponse;
}
