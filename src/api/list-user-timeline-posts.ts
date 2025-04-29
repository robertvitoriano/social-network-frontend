import { api } from "./api"

export async function listUserTimelinePosts(handle: string) {
  const userFeedPostsResponse = await api.get(`/feed/timeline/${handle}`)
  return userFeedPostsResponse
}
