import { api } from "./api";

export async function listUserFeedPosts(userId: string) {
  const userFeedPostsResponse = await api.get(`/feed/${userId}`);
  return userFeedPostsResponse;
}
