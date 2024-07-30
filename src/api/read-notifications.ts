import { api } from "./api";

export async function readNotifications(unreadNotificationIds: string[]) {
  const readNotificationsResponse = await api.patch("/notifications/read", {
    unreadNotificationIds,
  });
  return readNotificationsResponse;
}
