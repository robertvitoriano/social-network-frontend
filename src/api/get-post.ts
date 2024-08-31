import { api } from "./api";

export async function getPost(postId: string) {
  const profileResponse = await api.get(`/feed/post/${postId}`);
  return profileResponse;
}
