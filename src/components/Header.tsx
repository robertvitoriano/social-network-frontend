"use client";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { NotificationsPopOver } from "./NotificationsPopOver";
import { listUserNotifications } from "@/api/list-user-notifications";
import UpdateProfileModal from "./UpdateProfileModal";
import { useAuthStore } from "@/lib/store/authStore";
import { useFriendshipStore } from "@/lib/store/friendshipStore";

export function Header() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsPopOverOpen, setIsNotificationsPopOverOpen] =
    useState(false);
  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
  const [isThereNotReadNotification, setIsThereNotReadNotification] =
    useState(false);

  const loggedUser = useAuthStore((state) => state.loggedUser);
  const toggleNotificationsPopOver = () => {
    setIsNotificationsPopOverOpen((prev) => !prev);
  };

  const fetchFriendshipSugestions = useFriendshipStore(
    (state) => state.fetchFriendshipSugestions
  );

  const fetchUserFriends = useFriendshipStore(
    (state) => state.fetchUserFriends
  );

  useEffect(() => {
    if (!loggedUser.id) return;

    const userId = loggedUser.id;
    socket.emit(EventType.USER_JOIN_ROOM, userId);

    const handleFriendshipRequest = async (
      receveidFriendshipRequestNotification: any
    ) => {
      checkNotReadNotifications([receveidFriendshipRequestNotification]);
      setNotifications([
        ...notifications,
        receveidFriendshipRequestNotification,
      ]);
      await fetchFriendshipSugestions();
    };

    const handleFriendshipAccepted = async (
      receveidFriendshipAcceptedNotification: any
    ) => {
      checkNotReadNotifications([receveidFriendshipAcceptedNotification]);
      setNotifications([
        ...notifications,
        receveidFriendshipAcceptedNotification,
      ]);
      await fetchFriendshipSugestions();
      await fetchUserFriends();
    };
    const handleMessageReceived = async (receveidMessageNotification: any) => {
      checkNotReadNotifications([receveidMessageNotification]);
      setNotifications([...notifications, receveidMessageNotification]);
    };
    socket.on(EventType.FRIENDSHIP_REQUEST, handleFriendshipRequest);
    socket.on(EventType.FRIENDSHIP_ACCEPTED, handleFriendshipAccepted);
    socket.on(EventType.MESSAGE_RECEIVED, handleMessageReceived);

    loadNotifications();
    return () => {
      socket.off(EventType.MESSAGE_RECEIVED, handleMessageReceived);
      socket.off(EventType.FRIENDSHIP_REQUEST, handleFriendshipRequest);
      socket.off(EventType.FRIENDSHIP_ACCEPTED, handleFriendshipAccepted);
    };
  }, [loggedUser.id]);

  const checkNotReadNotifications = (newNotifications: any[]) => {
    setIsThereNotReadNotification(
      newNotifications.some((notification) => !notification.wasRead)
    );
  };

  async function loadNotifications() {
    try {
      const notificationResponse = await listUserNotifications();

      checkNotReadNotifications(notificationResponse.data.userNotifications);

      setNotifications(notificationResponse.data.userNotifications);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  }

  return (
    <div className="flex gap-4 p-2 w-full bg-primary text-white font-bold justify-between">
      <img
        className="h-8 w-8 rounded-full bg-black cursor-pointer"
        src={loggedUser.avatar}
        alt="Profile image"
        onClick={() => setOpenUpdateProfileModal(true)}
      />
      <div className="relative">
        <Bell onClick={toggleNotificationsPopOver} />
        {isThereNotReadNotification && !isNotificationsPopOverOpen && (
          <div className="h-3 w-3 rounded-full bg-red-500 absolute top-0 z-40 right-0"></div>
        )}
      </div>
      {isNotificationsPopOverOpen && (
        <NotificationsPopOver
          onClose={toggleNotificationsPopOver}
          notifications={notifications}
          loadNotifications={loadNotifications}
        />
      )}
      <UpdateProfileModal
        open={openUpdateProfileModal}
        onClose={() => setOpenUpdateProfileModal(false)}
      />
    </div>
  );
}
