import { api } from "./api";

export async function listUserTimelinePosts(userId: string) {
  const userFeedPostsResponse = await api.get(`/feed/timeline/${userId}`);
  return userFeedPostsResponse;
}
