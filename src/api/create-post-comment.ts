import { api } from "./api";
type commentParams = {
  content: string;
  postId: string;
  parentCommentId?: string;
};

export async function createPostComment({ content, postId, parentCommentId }: commentParams): Promise<any> {
  const chatMessageResponse = await api.post("/feed/comments", {
    postId,
    content,
    parentCommentId,
  });
  return chatMessageResponse;
}
