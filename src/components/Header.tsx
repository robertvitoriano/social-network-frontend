"use client";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
export function Header() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    socket.emit(EventType.USER_JOIN_ROOM, userId);

    socket.on(EventType.FRIENDSHIP_REQUEST, (notification: string) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => {
      socket.off(EventType.FRIENDSHIP_REQUEST);
    };
  }, []);

  return (
    <div className="flex gap-4 p-4 w-full bg-gray-400 text-white font-bold justify-between">
      <h1>HEADER</h1>
      <div className="relative">
        <Bell />
        {notifications.length > 0 && (
          <div className="h-3 w-3 rounded-full bg-red-500 absolute top-0 z-40 right-0"></div>
        )}
      </div>
    </div>
  );
}
