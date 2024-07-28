import { api } from "./api";

export async function sendFriendshipRequest(friendId: string) {
  const friendshipRequestResponse = await api.patch("/friendships/send", {
    friendId,
  });
  return friendshipRequestResponse;
}
