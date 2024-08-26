"use client";

import { useEffect } from "react";
import NotificationRenderer from "./NotificationRenderer";
import { readNotifications } from "@/api/read-notifications";
import { useRouter } from "next/navigation";
interface NotificationsPopOverProps {
  onClose: () => void;
  notifications: any[];
  loadNotifications: () => Promise<void>;
}

export function NotificationsPopOver({
  onClose,
  notifications,
  loadNotifications,
}: NotificationsPopOverProps) {
  const router = useRouter();
  useEffect(() => {
    handleReadNotifications();
    console.log({ notifications });
  }, []);

  async function handleReadNotifications() {
    const notReadNotificationIds = notifications
      .filter((notification) => !notification.wasRead)
      .map((notification) => notification.id);
    if (notReadNotificationIds.length > 0) {
      await readNotifications(notReadNotificationIds);
    }
  }

  async function handleClose() {
    loadNotifications();
    onClose();
  }
  async function navigateToSenderProfile(senderId: string) {
    onClose();
    router.push(`/profile/${senderId}`);
  }

  return (
    <div className="fixed top-0 right-0 h-full w-full bg-gray-800 text-white z-50 overflow-y-auto">
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button onClick={handleClose} className="text-white">
          X
        </button>
      </div>
      <div className="p-4">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li
                key={index}
                className="mb-2  cursor-pointer hover:underline"
                onClick={() => navigateToSenderProfile(notification.senderId)}
              >
                <NotificationRenderer notification={notification} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
