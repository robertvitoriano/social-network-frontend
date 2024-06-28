import { api } from "./api";

export async function listNonFriends() {
  const noFriendsResponse = await api.get("/friendships/non-friends");
  return noFriendsResponse;
}
