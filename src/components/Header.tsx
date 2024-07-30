"use client";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { NotificationsPopOver } from "./NotificationsPopOver";
import { listUserNotifications } from "@/api/list-user-notifications";
import UpdateProfileModal from "./UpdateProfileModal";
import { useAuthStore } from "@/lib/store/authStore";

export function Header() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsPopOverOpen, setIsNotificationsPopOverOpen] =
    useState(false);
  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);

  const loggedUser = useAuthStore((state) => state.loggedUser);
  const toggleNotificationsPopOver = () => {
    setIsNotificationsPopOverOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!loggedUser.id) return;

    const userId = loggedUser.id;
    socket.emit(EventType.USER_JOIN_ROOM, userId);

    const handleFriendshipRequest = (
      receveidFriendshipRequestNotification: any
    ) => {
      setNotifications([
        ...notifications,
        receveidFriendshipRequestNotification,
      ]);
    };

    const handleFriendshipAccepted = (
      receveidFriendshipRequestNotification: any
    ) => {
      setNotifications([
        ...notifications,
        receveidFriendshipRequestNotification,
      ]);
    };

    socket.on(EventType.FRIENDSHIP_REQUEST, handleFriendshipRequest);
    socket.on(EventType.FRIENDSHIP_ACCEPTED, handleFriendshipAccepted);

    loadNotifications();

    return () => {
      socket.off(EventType.FRIENDSHIP_REQUEST, handleFriendshipRequest);
      socket.off(EventType.FRIENDSHIP_ACCEPTED, handleFriendshipAccepted);
    };
  }, [loggedUser.id]);

  async function loadNotifications() {
    try {
      const notificationResponse = await listUserNotifications();
      const notificationIds = notifications.map((n) => n.id);
      const filteredNotifications =
        notificationResponse.data.userNotifications.filter(
          (n: any) => !notificationIds.includes(n.id)
        );
      setNotifications([...notifications, ...filteredNotifications]);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  }

  return (
    <div className="flex gap-4 p-2 w-full bg-gray-400 text-white font-bold justify-between">
      <img
        className="h-8 w-8 rounded-full bg-black cursor-pointer"
        src={loggedUser.avatar}
        alt="Profile image"
        onClick={() => setOpenUpdateProfileModal(true)}
      />
      <div className="relative">
        <Bell onClick={toggleNotificationsPopOver} />
        {notifications.length > 0 && !isNotificationsPopOverOpen && (
          <div className="h-3 w-3 rounded-full bg-red-500 absolute top-0 z-40 right-0"></div>
        )}
      </div>
      {isNotificationsPopOverOpen && (
        <NotificationsPopOver
          isOpen={isNotificationsPopOverOpen}
          onClose={toggleNotificationsPopOver}
          notifications={notifications}
        />
      )}
      <UpdateProfileModal
        open={openUpdateProfileModal}
        onClose={() => setOpenUpdateProfileModal(false)}
      />
    </div>
  );
}
