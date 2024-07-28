import { api } from "./api";

export async function sendFriendshipResponse(friendId: string, status: string) {
  await api.patch("/friendships/finish", {
    friendId,
    status,
  });
}
