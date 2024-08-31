import { api } from "./api";

export async function toggleCommentLike(commentId: string): Promise<any> {
  const toggleCommentResponse = await api.post("/feed/likes", { commentId });
  return toggleCommentResponse;
}
