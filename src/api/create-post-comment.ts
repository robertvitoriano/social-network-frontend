import { api } from "./api";
type commentParams = {
  content: string;
  postId: string;
};

export async function createPostComment({
  content,
  postId,
}: commentParams): Promise<any> {
  const chatMessageResponse = await api.post("/feed/comments", {
    postId,
    content,
  });
  return chatMessageResponse;
}
