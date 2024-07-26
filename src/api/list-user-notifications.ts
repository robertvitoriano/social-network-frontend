import { api } from "./api";

export async function listUserNotifications() {
  const noFriendsResponse = await api.get(
    "/notifications/list-user-notifications"
  );
  return noFriendsResponse;
}
