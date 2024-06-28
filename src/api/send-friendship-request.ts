import { api } from "./api";

export async function sendFriendshipRequest(friendId: string) {
  const friendshipRequestResponse = await api.post("/friendships/send", {
    friendId,
  });
  return friendshipRequestResponse;
}
