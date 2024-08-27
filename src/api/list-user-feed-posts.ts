import { api } from "./api";

export async function listUserFeedPosts() {
  const userFeedPostsResponse = await api.get("/feed");
  return userFeedPostsResponse;
}
