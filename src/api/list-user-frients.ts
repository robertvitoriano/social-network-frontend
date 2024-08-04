import { api } from "./api";

export async function listUserFriends() {
  const userFriendsResponse = await api.get("/friendships");
  return userFriendsResponse;
}
