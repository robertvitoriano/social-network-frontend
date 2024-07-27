"use client";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { Sidebar } from "./Sidebar";
import { listUserNotifications } from "@/api/list-user-notifications";
import UpdateProfileModal from "./UpdateProfileModal";
import { useAuthStore } from "@/lib/store/authStore";
export function Header() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);

  const loggedUser = useAuthStore((state) => state.loggedUser);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    const userId = loggedUser.id;
    socket.emit(EventType.USER_JOIN_ROOM, userId);

    socket.on(EventType.FRIENDSHIP_REQUEST, (notification: string) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    loadNotifications();

    return () => {
      socket.off(EventType.FRIENDSHIP_REQUEST);
    };
  }, []);
  async function loadNotifications() {
    const notificationsResponse = await listUserNotifications();
    console.log({ notificationsResponse });
  }
  return (
    <div className="flex gap-4 p-2 w-full bg-gray-400 text-white font-bold justify-between">
      <div
        className="h-8 w-8 rounded-full bg-black"
        onClick={() => setOpenUpdateProfileModal(true)}
      ></div>
      <div className="relative">
        <Bell onClick={toggleSidebar} />
        {notifications.length > 0 && (
          <div className="h-3 w-3 rounded-full bg-red-500 absolute top-0 z-40 right-0"></div>
        )}
      </div>
      {isSidebarOpen && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          notifications={notifications}
        />
      )}
      <UpdateProfileModal
        open={openUpdateProfileModal}
        onClose={() => setOpenUpdateProfileModal(false)}
        user={{
          name: "Robert",
          avatar:
            "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
          email: "robert@robert.com",
          password: "123",
          username: "robertvitoriano",
        }}
      />
    </div>
  );
}
